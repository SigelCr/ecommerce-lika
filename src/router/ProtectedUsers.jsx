//maneja logica cuando deja entrar o no el carrito shop, depende si el usuario esta logeado o no

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProtectedUsers = () => {
  const navigate = useNavigate();

  const { isLogged } = useContext(AuthContext);

  const alertForMenu = () => {
    <Outlet />;
    Swal.fire({
      position: "center",
      title: "Debes tener una cuenta para ver esta seccion",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Iniciar sesion",
      denyButtonText: `Volver a inicio`,
      toast: true,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      } else if (result.isDenied) {
        navigate("/");
      }
    });
  };

  return <>{isLogged ? <Outlet /> : alertForMenu()}</>;
};

export default ProtectedUsers;
