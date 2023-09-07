const ItemDetail = ({ product, counter, addOne, subOne, onAdd, quantity }) => {
  return (
    <div key={product?.id}>
      <h1>detalle</h1>
      {product && (
        <div>
          <h2>Titulo:{product.title}</h2>
          <img src={product.image} alt="" style={{ width: "100px" }} />
          <h2>Precio:{product.unit_price}</h2>
        </div>
      )}

      {quantity && (
        <h6>
          Ahora tenes {quantity} {product?.title} en el carrito
        </h6>
      )}

      <div style={{ display: "flex" }}>
        <button onClick={addOne}>+</button>
        <h4>{counter}</h4>
        <button onClick={subOne}>-</button>
        <button onClick={onAdd}>agregar al carrito</button>
      </div>
    </div>
  );
};

export default ItemDetail;
