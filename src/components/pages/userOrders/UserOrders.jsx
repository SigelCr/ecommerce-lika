import { useContext, useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";

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
    <div>
      estoy en mis ordenes
      {myOrders.map((order) => {
        return (
          <div key={order.id} style={{ border: "2px solid black" }}>
            {order.items.map((prod) => {
              return (
                <div key={prod.id}>
                  <h2>{prod.title}</h2>
                  <h3>{prod.quantity}</h3>
                </div>
              );
            })}
            <h3>total de la orden es ${order.total}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default UserOrders;
