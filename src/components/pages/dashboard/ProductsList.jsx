import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import DescriptionIcon from "@mui/icons-material/Description";
import CreateIcon from "@mui/icons-material/Create";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { db } from "../../../firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import ProductsForm from "./ProductsForm";

//estilos para el modal
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

const ProductsList = ({ products, setModifiedProduct }) => {
  const [open, setOpen] = useState(false);

  const editProduct = (id) => {
    console.log(id);
  };

  const deleteProduct = (id) => {
    deleteDoc(doc(db, "products", id));
    console.log(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Agregar nuevo producto
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Id</TableCell>
              <TableCell align="left">Nombre</TableCell>
              <TableCell align="left">Descripcion</TableCell>
              <TableCell align="left">Precio</TableCell>
              <TableCell align="left">Stock</TableCell>
              <TableCell align="left">Imagen</TableCell>
              <TableCell align="left">Categoria</TableCell>
              <TableCell align="left">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((prod) => (
              <TableRow
                key={prod.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {prod.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {prod.title}
                </TableCell>
                <TableCell component="th" scope="row">
                  {prod.description}
                </TableCell>
                <TableCell component="th" scope="row">
                  {prod.unit_price}
                </TableCell>
                <TableCell component="th" scope="row">
                  {prod.stock}
                </TableCell>
                <TableCell component="th" scope="row">
                  <img
                    src={prod.image}
                    style={{ width: "80px", height: "100px" }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {prod.category}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <IconButton
                    onClick={() => {
                      editProduct(prod.id);
                    }}
                  >
                    Editar
                    <CreateIcon />
                    <DescriptionIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      deleteProduct(prod.id);
                    }}
                  >
                    Eliminar
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ProductsForm
            handleClose={handleClose}
            setModifiedProduct={setModifiedProduct}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default ProductsList;
