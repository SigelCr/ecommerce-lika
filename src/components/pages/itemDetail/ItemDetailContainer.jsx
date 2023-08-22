import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { getDoc, collection, doc } from "firebase/firestore";
import ItemDetail from "./ItemDetail";
import Swal from "sweetalert2";
import { CartContext } from "../../../context/CartContext";

const ItemDetailContainer = () => {
  const { id } = useParams(); //con esto traemos la ruta dinamica, traemos el id del producto
  const { addToCart, getQuantityById } = useContext(CartContext);
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
