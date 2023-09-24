import style from "./ItemDetail.module.css";

const ItemDetail = ({ product, counter, addOne, subOne, onAdd, quantity }) => {
  const loading = (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <img
        src="https://firebasestorage.googleapis.com/v0/b/ecommerce-lika.appspot.com/o/297%20(1).gif?alt=media&token=175eda9c-354b-4b15-9d3a-b045422b1f21"
        alt="loading"
        className={style.loading}
      />
    </div>
  );

  return (
    <>
      {product ? (
        <div className={style.cardDetailContainer} key={product?.id}>
          {product && (
            <div className={style.cardDetail}>
              <img className={style.img} src={product.image} alt="" />
              <div className={style.containerInfo}>
                <div className={style.title}>
                  <h2>{product.title}</h2>
                </div>
                <div className={style.description}>
                  <p>{product.description}</p>
                </div>
                <div className={style.price}>
                  <h2>${product.unit_price}</h2>
                </div>
                {/*counter*/}
                {product?.stock > 0 ? (
                  <div className={style.counterContainer}>
                    <div className={style.counter}>
                      <button onClick={addOne}>+</button>
                      <h4>{counter}</h4>
                      <button onClick={subOne}>-</button>
                    </div>
                    <div className={style.btnCart}>
                      <button onClick={onAdd}>agregar al carrito</button>
                    </div>
                  </div>
                ) : (
                  <h1
                    style={{
                      fontSize: "15px",
                      fontFamily: "arial",
                      margin: "10px",
                      padding: "10px",
                    }}
                  >
                    No hay stock
                  </h1>
                )}
              </div>
            </div>
          )}

          {quantity && (
            <h6>
              Ahora tenes {quantity} {product?.title} en el carrito
            </h6>
          )}
        </div>
      ) : (
        <h1>{loading}</h1>
      )}
    </>
  );
};

export default ItemDetail;
