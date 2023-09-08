import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ProductsList from "./ProductsList";
const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [modifiedProduct, setModifiedProduct] = useState(false);

  useEffect(() => {
    setModifiedProduct(false);
    let productsCollection = collection(db, "products");
    getDocs(productsCollection).then((res) => {
      const newArr = res.docs.map((product) => {
        return {
          ...product.data(),
          id: product.id,
        };
      });
      setProducts(newArr);
    });
  }, [modifiedProduct]); //que escuche si algun producto fue modificado, creado, editado,borrado

  console.log(products);

  return (
    <div>
      <h4>Zona para subir, editar, eliminar productos:</h4>
      <ProductsList
        products={products}
        setModifiedProduct={setModifiedProduct}
      />
    </div>
  );
};

export default Dashboard;
