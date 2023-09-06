import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../../context/CartContext";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";
import { TextField } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const Checkout = () => {
  const { cart, getTotalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [preferenceId, setPreferenceId] = useState(null);
  const [userData, setUserData] = useState({
    cp: "",
    phone: "",
  });

  const [orderId, setOrderId] = useState(null);

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
    }
  }, [paramValue]);

  initMercadoPago(import.meta.env.VITE_PUBLICKEY, {
    locale: "es-AR",
  });

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
        "http://localhost:8080/create_preference",
        {
          items: newArray, //los items son los productos que van aparecer en mercadopago
          shipment_cost: 10, //costo de envio
        }
      );

      const { id } = response.data;
      return id;
    } catch (error) {
      console.log(error);
    }
  };

  let total = getTotalPrice();

  const handleBuy = async () => {
    // creamos la variable order para que esto sea la orden de compra que se va a guardar en firebase
    let order = {
      cp: userData.cp,
      phone: userData.phone,
      items: cart,
      total,
      email: user.email,
    };
    //guardamos la variable en el local storage para que cuando se abra el wallet de mercadopago y vuelva a la pagina, que se recarga, que no se pierdan los datos, luego los traemos como hice mas arriba en el useEffect
    localStorage.setItem("order", JSON.stringify(order));
    const id = await createPreference(); //llamamos el id de createPreference
    if (id) {
      setPreferenceId(id);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value }); //para capturar lo que se escribe, el textfield
  };

  return (
    <div>
      {!orderId ? (
        <>
          <TextField
            name="cp"
            variant="outlined"
            label="Codigo postal"
            onChange={handleChange}
          />
          <TextField
            name="phone"
            variant="outlined"
            label="Telefono"
            onChange={handleChange}
          />
          <button onClick={handleBuy}>seleccione metodo de pago</button>
        </>
      ) : (
        <>
          <h2>El pago se realizo exitosamente</h2>
          <h3>su orden de compra es {orderId}</h3>
          <Link to="/shop">Seguri comprando</Link>
        </>
      )}
      {preferenceId && (
        <Wallet initialization={{ preferenceId, redirectMode: "self" }} />
      )}
    </div>
  );
};

export default Checkout;
