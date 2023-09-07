import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import ItemList from "./ItemList";

const ItemListContainer = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let myCollection = collection(db, "products");
    let getCollectionProducts = getDocs(myCollection); //obtene el documento mycollection que de la db, es products
    getCollectionProducts
      .then((res) => {
        //para desenscriptar los productos cargados en firebase
        let newArray = res.docs.map((product) => {
          return { ...product.data(), id: product.id }; //porque firebase trae el id aparte entonces hay que unirlo en un solo objeto
        });
        setProducts(newArray);
      })
      .catch((error) => console.log(error));
  }, []);

  console.log(products);

  return (
    <h1>
      <ItemList products={products} />
    </h1>
  );
};

export default ItemListContainer;
