import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../../context/CartContext";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "./FormCheckout.module.css";

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [preferenceId, setPreferenceId] = useState(null);

  /*   const [userData, setUserData] = useState({
    cp: "",
    phone: "",
  }); */

  const [orderId, setOrderId] = useState(null);
  const [shipmentCost, setShipmentCost] = useState(0);

  const location = useLocation(); //para guardar los query.params que devuelve mercadopago
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("status"); //con el get traemos el paramero que se llama status, lo que esta en comillas

  //aca es donde guardamos la orden en firebase
  useEffect(() => {
    //condicionado a que ya este el pago realizado
    //gaurdamos en una variable order lo que yo habia seteado o guardado en el local storage, que ere ese objeto order que tenia el cp email etc
    let order = JSON.parse(localStorage.getItem("order"));
    if (paramValue === "approved") {
      //el approved es cuando ya esta realizado el pago completamente
      let ordersCollection = collection(db, "orders");
      addDoc(ordersCollection, { ...order, date: serverTimestamp() }).then(
        (res) => {
          //agrega la orden con todo lo que este en orders + el date, que es la fecha que trae firebase
          setOrderId(res.id); //para que el usuario pueda usar el id, para reclamo o algo
        }
      );
      order.items.forEach((elemento) => {
        updateDoc(doc(db, "products", elemento.id), {
          stock: elemento.stock - elemento.quantity,
        });
      });

      localStorage.removeItem("order");
      clearCart(); //traido de cartcontext para que al finalizar la compra el carrito aparezca vacio
    }
  }, [paramValue]);

  initMercadoPago(import.meta.env.VITE_PUBLICKEY, {
    locale: "es-AR",
  });

  useEffect(() => {
    //costo de envio
    let shipmentCollection = collection(db, "shipment");
    let shipmentDoc = doc(shipmentCollection, "nJfzlXPLFzkZzKwIITL7");
    getDoc(shipmentDoc)
      .then((res) => {
        setShipmentCost(res.data().cost);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const createPreference = async () => {
    //en vez de mandar un arreglo con toda la informacion (cart), le mandamos un nuevo arreglo a partir de cart pero que tenga las propiedades necesarias asi no le mandamos tanta informacion al backend
    const newArray = cart.map((product) => {
      return {
        title: product.title,
        unit_price: product.unit_price,
        quantity: product.quantity,
      };
    });
    try {
      let response = await axios.post(
        "https://backend-tiendalika.vercel.app/create_preference",
        {
          items: newArray, //los items son los productos que van aparecer en mercadopago
          shipment_cost: shipmentCost, //costo de envio
        }
      );

      const { id } = response.data;
      return id;
    } catch (error) {
      console.log(error);
    }
  };

  let total = getTotalPrice();

  const handleSubmit = async () => {
    // creamos la variable order para que esto sea la orden de compra que se va a guardar en firebase
    let order = {
      name: formik.values.name,
      cp: formik.values.cp,
      phone: formik.values.phone,
      address: formik.values.address,
      items: cart,
      total: total + shipmentCost,
      email: user.email,
    };
    //guardamos la variable en el local storage para que cuando se abra el wallet de mercadopago y vuelva a la pagina, que se recarga, que no se pierdan los datos, luego los traemos como hice mas arriba en el useEffect
    localStorage.setItem("order", JSON.stringify(order));
    const id = await createPreference(); //llamamos el id de createPreference
    if (id) {
      setPreferenceId(id);
    }
  };

  /*   const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value }); //para capturar lo que se escribe, el textfield
  }; */

  const formik = useFormik({
    initialValues: {
      name: "",
      cp: "",
      phone: "",
      address: "",
    },
    onSubmit: handleSubmit,
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required("Este campo es obligatorio")
        .min(3, "El nombre debe tener como minimo 3 caracteres"),
      cp: Yup.string()
        .required("Este campo es obligatorio")
        .min(4, "El codigo postal debe tener como minimo 4 caracteres"),
      phone: Yup.string()
        .required("Este campo es obligatorio")
        .min(6, "El numero de telefono debe tener como minimo 4 caracteres"),
      address: Yup.string()
        .required("Este campo es obligatorio")
        .min(10, "Direccion de punto de entrega con una pequeña explicacion"),
    }),
    validateOnChange: false,
  });

  console.log(formik.errors);

  return (
    <div>
      {!orderId ? (
        <>
          <div className={styled.container}>
            {formik.values &&
              formik.values.name &&
              formik.values.name.length > 0 && (
                <p className={styled.p}>
                  Le aparecera el boton de comprar una vez que complete todos
                  los campos correctamente
                </p>
              )}
            <form
              onSubmit={formik.handleSubmit}
              className={styled.containerInput}
            >
              <TextField
                name="name"
                variant="outlined"
                label="Nombre"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.errors.name ? true : false}
                helperText={formik.errors.name}
                className={styled.input}
              />
              <TextField
                name="cp"
                variant="outlined"
                label="Codigo postal"
                value={formik.values.cp}
                onChange={formik.handleChange}
                error={formik.errors.cp ? true : false}
                helperText={formik.errors.cp}
                className={styled.input}
              />
              <TextField
                name="phone"
                variant="outlined"
                label="Telefono"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.errors.phone ? true : false}
                helperText={formik.errors.phone}
                className={styled.input}
              />
              <TextField
                name="address"
                variant="outlined"
                label="Direccion"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.errors.address ? true : false}
                helperText={formik.errors.address}
                className={styled.input}
              />

              {!formik.errors.name &&
                !formik.errors.cp &&
                !formik.errors.phone &&
                !formik.errors.address &&
                formik.values.address.length >= 10 && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button type="submit" className={styled.btn}>
                      Iniciar compra
                    </Button>
                  </div>
                )}
            </form>
            <Link to="/cart">Regresar</Link>
          </div>
        </>
      ) : (
        <>
          <h2>El pago se realizo exitosamente</h2>
          <h3>su orden de compra es {orderId}</h3>
          <Link to="/shop">Seguir comprando</Link>
        </>
      )}
      {preferenceId && (
        <Wallet initialization={{ preferenceId, redirectMode: "self" }} />
      )}
    </div>
  );
};

export default Checkout;

/*

    <div>
      {!orderId ? (
        <>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              name="name"
              variant="outlined"
              label="Nombre"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <TextField
              name="cp"
              variant="outlined"
              label="Codigo postal"
              value={formik.values.cp}
              onChange={formik.handleChange}
            />
            <TextField
              name="phone"
              variant="outlined"
              label="Telefono"
              value={formik.values.phone}
              onChange={formik.handleChange}
            />
            <button type="submit">seleccione metodo de pago</button>
          </form>
        </>
      ) : (
        <>
          <h2>El pago se realizo exitosamente</h2>
          <h3>su orden de compra es {orderId}</h3>
          <Link to="/shop">Seguir comprando</Link>
        </>
      )}
      {preferenceId && (
        <Wallet initialization={{ preferenceId, redirectMode: "self" }} />
      )}
    </div>

*/
