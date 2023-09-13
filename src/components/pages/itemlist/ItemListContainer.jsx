import { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import ItemList from "./ItemList";
import { Link, useParams } from "react-router-dom";
import style from "./ItemList.module.css";
import { db } from "../../../firebaseConfig";

const ItemListContainer = () => {
  const [products, setProducts] = useState([]);

  const { categoryName } = useParams();

  useEffect(() => {
    //filtrado de categorias
    let consulta;
    const productsCollection = collection(db, "products");

    if (categoryName) {
      const productsCollectionFiltered = query(
        productsCollection,
        where("category", "==", categoryName)
      );
      consulta = productsCollectionFiltered;
    } else {
      consulta = productsCollection;
    }

    let getCollectionProducts = getDocs(consulta); //obtene el documento mycollection que de la db, es products
    getCollectionProducts
      .then((res) => {
        //para desenscriptar los productos cargados en firebase
        let newArray = res.docs.map((product) => {
          return { ...product.data(), id: product.id }; //porque firebase trae el id aparte entonces hay que unirlo en un solo objeto
        });
        setProducts(newArray);
      })
      .catch((error) => console.log(error));
  }, [categoryName]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const categoriesCollection = collection(db, "categories");
    getDocs(categoriesCollection)
      .then((res) => {
        let categoriesResult = res.docs.map((category) => {
          return {
            ...category.data(),
            id: category.id,
          };
        });
        setCategories(categoriesResult);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //tecnica de renderizado antes de que se vean los productos
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

  //para el menu filtrado

  return (
    <>
      {products.length === 0 && loading}
      <div className={style.categories}>
        {categories.map((category) => {
          return (
            <Link
              key={category.id}
              to={category.path}
              className={style.filtros}
            >
              {category.title}
            </Link>
          );
        })}
      </div>
      <div>
        <ItemList products={products} />
      </div>
    </>
  );
};

export default ItemListContainer;
