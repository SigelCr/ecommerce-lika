import { Link } from "react-router-dom";
import style from "./ItemList.module.css";

const ItemList = ({ products }) => {
  return (
    <div className={style.containerCard}>
      {products.map((product) => {
        return (
          <div className={style.card} key={product.id}>
            <img className={style.image} src={product.image} alt="" />
            <div className={style.title}>
              <h2>{product.title}</h2>
            </div>
            <div className={style.description}>
              <h3>{product.description}</h3>
            </div>
            <div className={style.price}>
              <h3>${product.unit_price}</h3>
            </div>
            <div className={style.btn}>
              <Link
                to={`/itemDetail/${product.id}`}
                className={style.btnDetail}
              >
                <button>Ver detalle</button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ItemList;
