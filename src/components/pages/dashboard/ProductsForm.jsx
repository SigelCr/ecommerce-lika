import { Button, TextField } from "@mui/material";

const ProductsForm = () => {
  return (
    <div>
      <form
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <TextField
          variant="outlined"
          //      defaultValue={}
          label="Nombre"
          name="title"
          //     onChange={handleChange}
        />
        <TextField
          variant="outlined"
          //    defaultValue={}
          label="Descripcion"
          name="description"
          //     onChange={handleChange}
        />
        <TextField
          variant="outlined"
          //      defaultValue={}
          label="Precio"
          name="unit_price"
          //     onChange={handleChange}
        />
        <TextField
          variant="outlined"
          //    defaultValue={}
          label="Stock"
          name="stock"
          //      onChange={handleChange}
        />
        <TextField
          variant="outlined"
          //     defaultValue={}
          label="Categoria"
          name="category"
          //      onChange={handleChange}
        />
        <TextField
          variant="outlined"
          //      defaultValue={}
          label="Imagen"
          name="imagen"
          //      onChange={handleChange}
        />
        <Button>Crear</Button>
      </form>
    </div>
  );
};

export default ProductsForm;
