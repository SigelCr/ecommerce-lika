import { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import style from "./Cart.module.css";

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
          <h3
            style={{
              fontSize: "10px",
              textAlign: "end",
              marginBottom: "20px",
            }}
          >
            <Link to="/shop" style={{ color: "grey" }}>
              Ver mas productos
            </Link>
          </h3>
          {cart.map((product) => {
            return (
              <div className={style.container} key={product.id}>
                <img className={style.img} src={product.image} alt="" />
                <div className={style.titleAndDescription}>
                  <h1 className={style.title}>{product.title}</h1>
                  <h3 className={style.fullDescription}>
                    {product.fullDescription}
                  </h3>
                </div>
                <div className={style.stockAndPriceAndQuantAndBtn}>
                  <h3 className={style.quantity}>
                    Cantidad {product.quantity}
                  </h3>
                  <h3 className={style.stock}>Stock {product.stock}</h3>
                  <h3 className={style.price}>ARS ${product.unit_price}</h3>
                  <button onClick={() => deleteById(product.id)}>
                    eliminar producto
                  </button>
                </div>
              </div>
            );
          })}
          <div className={style.containerFinalBtn}>
            <h5 style={{ fontSize: "18px" }}>Total ARS ${total}</h5>
            <div>
              <button onClick={clearCartWithAlert}>Limpiar carrito</button>

              <button>
                <Link to="/checkout">Finalizar compra</Link>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={style.containerAddProduct}>
          <h1>No hay ningun producto agregado al carrito</h1>
          <Link to="/shop">
            <button>Ver productos</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
