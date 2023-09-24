import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { db, uploadFile } from "../../../firebaseConfig";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

const ProductsForm = ({
  handleClose,
  setModifiedProduct,
  setProductSelected,
  productSelected,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    fullDescription: "",
    unit_price: 0,
    stock: 0,
    category: "",
    image: "",
  });

  const [file, setFile] = useState(null);

  const handleImage = async () => {
    setIsLoading(true);
    let url = await uploadFile(file); //la url de la imagen, es la propiedad image

    if (productSelected) {
      //editando
      setProductSelected({
        ...productSelected,
        image: url,
      });
    } else {
      //creando
      setNewProduct({ ...newProduct, image: url });
    }
    setIsLoading(false); //cuando temrina de cargar la imagen se pasa a false
  };

  const handleChange = (e) => {
    if (productSelected) {
      setProductSelected({
        //para editar el producto
        ...productSelected,
        [e.target.name]: e.target.value,
      });
    } else {
      setNewProduct({
        ...newProduct,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productsCollection = collection(db, "products");

    if (productSelected) {
      //editando
      let obj = {
        //para cambiar lo que viene como texto a numero
        ...productSelected,
        unit_price: +productSelected.unit_price,
        stock: +productSelected.stock,
      };
      updateDoc(doc(productsCollection, productSelected.id), obj).then(() => {
        setModifiedProduct(true);
        handleClose();
      });
    } else {
      //creando
      let obj = {
        //para cambiar lo que viene como texto a numero
        ...newProduct,
        unit_price: +newProduct.unit_price,
        stock: +newProduct.stock,
      };

      addDoc(productsCollection, obj).then(() => {
        setModifiedProduct(true);
        handleClose();
      });
    }
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
          defaultValue={productSelected?.title}
          label="Nombre"
          name="title"
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          defaultValue={productSelected?.description}
          label="Breve Descripcion"
          name="description"
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          defaultValue={productSelected?.fullDescription}
          label="Descripcion completa"
          name="fullDescription"
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          defaultValue={productSelected?.unit_price}
          label="Precio"
          name="unit_price"
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          defaultValue={productSelected?.stock}
          label="Stock"
          name="stock"
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          defaultValue={productSelected?.category}
          label="Categoria"
          name="category"
          onChange={handleChange}
        />
        <TextField
          type="file"
          variant="outlined"
          // defaultValue={productSelected?.image}
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
            <Button type="submit">
              {productSelected ? "Modificar producto" : "Crear producto"}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default ProductsForm;
