//maneja logica cuando deja entrar o no el carrito shop, depende si el usuario esta logeado o no

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedUsers = () => {
  const { isLogged } = useContext(AuthContext);

  return <>{isLogged ? <Outlet /> : <Navigate to="/login" />}</>;
};

export default ProtectedUsers;
