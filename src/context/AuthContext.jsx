import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthContextComponent = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || {}
  );
  const [isLogged, setIsLogged] = useState(
    JSON.parse(localStorage.getItem("isLogged")) || false
  );

  //iniciar sesion
  const handleLogin = (userLogged) => {
    setUser(userLogged);
    setIsLogged(true);
    localStorage.setItem("userInfo", JSON.stringify(userLogged));
    localStorage.setItem("isLogged", JSON.stringify(true));
  };
  //cerrar sesion
  const logoutContext = () => {
    setUser({});
    setIsLogged(false);
    localStorage.removeItem("userInfo"); //ver si es userInfo o user
    localStorage.removeItem("isLogged");
  };

  const data = {
    user,
    isLogged,
    logoutContext,
    handleLogin,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export default AuthContextComponent;
