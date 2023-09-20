import { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, clearCart, deleteById, getTotalPrice } =
    useContext(CartContext);

  let total = getTotalPrice();

  const clearCartWithAlert = () => {
    Swal.fire({
      position: "center",
      title: "¿Seguro quieres vaciar todo el carrito?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Si",
      denyButtonText: `No`,
      toast: true,
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire({
          title: "Se limpio el carrito",
          toast: true,
        });
      } else if (result.isDenied) {
        Swal.fire({
          title: "El carrito sigue igual",
          toast: true,
        });
      }
    });
  };

  return (
    <div>
      {cart.length > 0 ? (
        <div>
          <h1>Productos agregados</h1>
          {cart.map((product) => {
            return (
              <div key={product.id}>
                <h1>{product.title}</h1>
                <img style={{ width: "100px" }} src={product.image} alt="" />
                <h2>Cantidad:{product.quantity}</h2>
                <button onClick={() => deleteById(product.id)}>
                  eliminar producto
                </button>
              </div>
            );
          })}
          <h5>El total a pagar es ${total}</h5>
          <button onClick={clearCartWithAlert}>
            eliminar todos los productos
          </button>
          <Link to="/checkout">Finalizar compra</Link>
        </div>
      ) : (
        <div>
          <h1>No hay ningun producto agregado al carrito</h1>
          <Link to="/shop">
            <button>Agregar productos</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
