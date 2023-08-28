import { useContext, useState } from "react";
import { CartContext } from "../../../context/CartContext";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";

const Checkout = () => {
  const { cart } = useContext(CartContext);

  const [preferenceId, setPreferenceId] = useState(null);

  initMercadoPago(import.meta.env.VITE_PUBLICKEY, {
    locale: "es-AR",
  });

  const createPreference = async () => {
    //en vez de mandar un arreglo con toda la informacion (cart), le mandamos un nuevo arreglo a partir de cart pero que tenga las propiedades necesarias asi no le mandamos tanta informacion al backend
    const newArray = cart.map((product) => {
      return {
        title: product.title,
        unit_price: product.unit_price,
        quantity: product.quantity,
      };
    });
    try {
      let response = await axios.post(
        "http://localhost:8080/create_preference",
        {
          items: newArray, //los items son los productos que van aparecer en mercadopago
          shipment_cost: 10, //costo de envio
        }
      );

      const { id } = response.data;
      return id;
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuy = async () => {
    const id = await createPreference(); //llamamos el id de createPreference
    if (id) {
      setPreferenceId(id);
    }
  };

  return (
    <div>
      <button onClick={handleBuy}>seleccione metodo de pago</button>
      {preferenceId && (
        <Wallet initialization={{ preferenceId, redirectMode: "self" }} />
      )}
    </div>
  );
};

export default Checkout;
