import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { db, uploadFile } from "../../../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const ProductsForm = ({ handleClose, setModifiedProduct }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    unit_price: 0,
    stock: 0,
    category: "",
    image: "",
  });

  const [file, setFile] = useState(null);

  const handleImage = async () => {
    setIsLoading(true);
    let url = await uploadFile(file); //la url de la imagen, es la propiedad image
    setNewProduct({ ...newProduct, image: url });
    setIsLoading(false); //cuando temrina de cargar la imagen se pasa a false
  };

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let obj = {
      //para cambiar lo que viene como texto a numero
      ...newProduct,
      unit_price: +newProduct.unit_price,
      stock: +newProduct.stock,
    };
    const productsCollection = collection(db, "products");
    addDoc(productsCollection, obj).then(() => {
      setModifiedProduct(true);
      handleClose();
    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <TextField
          variant="outlined"
          //      defaultValue={}
          label="Nombre"
          name="title"
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          //    defaultValue={}
          label="Descripcion"
          name="description"
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          //      defaultValue={}
          label="Precio"
          name="unit_price"
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          //    defaultValue={}
          label="Stock"
          name="stock"
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          //     defaultValue={}
          label="Categoria"
          name="category"
          onChange={handleChange}
        />
        <TextField
          type="file"
          variant="outlined"
          //      defaultValue={}

          onChange={(e) => setFile(e.target.files[0])}
        />
        {file && (
          <>
            <h6 style={{ textAlign: "center" }}>
              Primero cargue la imagen a la base de datos
            </h6>
            <Button onClick={handleImage} type="button">
              {isLoading === false ? "Cargar imagen" : "Cargando..."}
            </Button>
          </>
        )}
        {file && !isLoading && (
          <>
            <h6 style={{ textAlign: "center" }}>
              Una vez cargada la imagen, ya puede crear el producto
            </h6>
            <Button type="submit">Crear producto</Button>
          </>
        )}
      </form>
    </div>
  );
};

export default ProductsForm;
