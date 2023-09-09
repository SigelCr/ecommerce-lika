import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import ProductsList from "./ProductsList";
import { Box, Button, Modal, TextField } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1, //pading
};

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [modifiedProduct, setModifiedProduct] = useState(false);
  const [open, setOpen] = useState(false);
  const [shipmentCost, setShipmentCost] = useState(null);

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

  const handleClose = () => {
    setOpen(false);
  };

  const updateShipment = async () => {
    updateDoc(doc(db, "shipment", "nJfzlXPLFzkZzKwIITL7"), {
      cost: shipmentCost,
    });
    setOpen(false);
  };

  return (
    <div>
      <h4>Zona para subir, editar, eliminar productos:</h4>
      <ProductsList
        products={products}
        setModifiedProduct={setModifiedProduct}
      />
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Modificar costo de envio
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            label="Costo"
            onChange={(e) => {
              setShipmentCost(+e.target.value);
            }}
          />
          <Button onClick={updateShipment}>Modificar</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Dashboard;
