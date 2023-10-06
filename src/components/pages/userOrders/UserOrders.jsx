import { useContext, useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";
import style from "./UserOrders.module.css";
import { Link } from "react-router-dom";

const UserOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const ordersCollection = collection(db, "orders");
    //no quiero traerme toda la collection de orders entonces uso el metodo query
    let ordersFiltered = query(
      ordersCollection,
      where("email", "==", user.email)
    );
    getDocs(ordersFiltered)
      .then((res) => {
        //en las res vienen los documentos, los documentos eran un arreglo que lo vamos a mapear con el .map
        const newArr = res.docs.map((order) => {
          //por cada order return un nuevo objeto con todo lo que tenga order.data(donde viene la informacion encriptada) pero el id viene en order.id
          return { ...order.data(), id: order.id };
        });
        setMyOrders(newArr);
      })
      .catch((error) => {
        console.log(error);
      });
    //cada vez que cambie user.email necesito a volver hacer la consulta;;
  }, [user.email]);

  return (
    <>
      {myOrders.length >= 1 ? (
        <div className={style.container}>
          <h1>estoy en mis ordenes</h1>
          {myOrders.map((order) => {
            return (
              <div key={order.id} className={style.containerCard}>
                {order.items.map((prod) => {
                  return (
                    <div key={prod.id}>
                      <div className={style.title}>
                        <h2>{prod.title}</h2>
                      </div>
                      <img className={style.image} src={prod.image} alt="" />
                      <div className={style.description}>
                        <h3>{prod.description}</h3>
                      </div>
                      <div className={style.price}>
                        <h3>${prod.unit_price}</h3>
                      </div>
                    </div>
                  );
                })}
                <h3>total de la orden es ${order.total}</h3>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ margin: "5px" }}>No has comprado nada aún</h1>
            <h3 style={{ margin: "5px" }}>!Chusmea nuestros productos!</h3>
            <Link to="/shop" style={{ color: "black" }}>
              Ver productos
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default UserOrders;
