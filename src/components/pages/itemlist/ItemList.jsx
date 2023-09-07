import { Link } from "react-router-dom";
import style from "./ItemList.module.css";

const ItemList = ({ products }) => {
  return (
    <div>
      <h1>Nuestros productos</h1>
      {products.map((product) => {
        return (
          <div className={style.container} key={product.id}>
            <h2>titulo:{product.title}</h2>
            <img className={style.image} src={product.image} alt="" />
            <h3>precio:{product.unit_price}</h3>
            <Link to={`/itemDetail/${product.id}`}>
              <button>Ver detalle</button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default ItemList;
