import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { getDoc, collection, doc } from "firebase/firestore";
import ItemDetail from "./ItemDetail";
import Swal from "sweetalert2";
import { CartContext } from "../../../context/CartContext";
import { AuthContext } from "../../../context/AuthContext";

const ItemDetailContainer = () => {
  const { id } = useParams(); //con esto traemos la ruta dinamica, traemos el id del producto
  const { addToCart, getQuantityById } = useContext(CartContext);
  const { isLogged } = useContext(AuthContext);
  let quantity = getQuantityById(id);
  const [product, setProduct] = useState(null);
  const [counter, setCounter] = useState(quantity || 1);
  const navigate = useNavigate();

  useEffect(() => {
    let myCollection = collection(db, "products");
    let myDoc = doc(myCollection, id);
    getDoc(myDoc)
      .then((res) => setProduct({ ...res.data(), id: res.id }))
      .catch((err) => console.log(err));
  }, [id]);

  //SUMAR
  const addOne = () => {
    if (counter < product?.stock) {
      setCounter(counter + 1);
    } else {
      Swal.fire({
        position: "center",
        title: `Stock Máximo`,
        timer: 2200,
        toast: true,
        timerProgressBar: true,
      });
    }
  };
  //RESTAR
  const subOne = () => {
    if (counter > 1) {
      setCounter(counter - 1);
    }
  };

  //AGREGAR AL CARRITO
  const onAdd = () => {
    let obj = {
      ...product,
      quantity: counter,
    };

    addToCart(obj);
    if (isLogged) {
      Swal.fire({
        position: "center",
        icon: "success",
        html: `Se agrego el producto ${product.title} al carrito`,
        timer: 20000,
        toast: true,
        timerProgressBar: true,
        showCancelButton: true,
        cancelButtonText: `Seguir navegando`,
        confirmButtonText: `Ir al carrito`,
        showCloseButton: true,
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton();
          confirmButton.addEventListener("click", () => {
            // Realizar la navegación utilizando el hook useNavigate
            navigate("/cart");
          });
        },
        willClose: () => {
          const confirmButton = Swal.getConfirmButton();
          confirmButton.removeEventListener("click", () => {
            // Eliminar el evento para evitar fugas de memoria
            navigate("/cart");
          });
        },
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "success",
        timer: 20000,
        toast: true,
        timerProgressBar: true,
        showCancelButton: true,
        cancelButtonText: `Seguir navegando`,
        confirmButtonText: `Ir al carrito`,
        showCloseButton: true,
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton();
          confirmButton.addEventListener("click", () => {
            // Realizar la navegación utilizando el hook useNavigate
            Swal.fire({
              position: "center",
              html: `Debes iniciar sesion para realizar una compra`,
              timer: 5000,
              toast: true,
              timerProgressBar: true,
              showCancelButton: true,
              cancelButtonText: `Seguir navegando`,
              confirmButtonText: `Iniciar sesion`,
              showCloseButton: true,

              willOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                confirmButton.addEventListener("click", () => {
                  navigate("/login");
                });
              },
            });
            //luego de 5s se navega al login
            setTimeout(() => {
              navigate("/login");
            }, 5000);
          });
        },
        willClose: () => {
          const confirmButton = Swal.getConfirmButton();
          confirmButton.removeEventListener("click", () => {
            // Eliminar el evento para evitar fugas de memoria
            alert("nada");
            navigate("/cart");
          });
        },
      });
    }
  };

  return (
    <div>
      <ItemDetail
        counter={counter}
        product={product}
        addOne={addOne}
        subOne={subOne}
        onAdd={onAdd}
        quantity={quantity}
      />
    </div>
  );
};

export default ItemDetailContainer;
