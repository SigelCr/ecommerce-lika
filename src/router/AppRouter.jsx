import { Route, Routes } from "react-router-dom";
import Navbar from "../components/layout/navbar/Navbar";
import { routes } from "./routes";
import Login from "../components/pages/login/Login";
import Register from "../components/pages/register/Register";
import ForgotPassword from "../components/pages/forgotPassword/ForgotPassword";
import Dashboard from "../components/pages/dashboard/Dashboard";
import ProtectedAdmin from "./ProtectedAdmin";
import ProtectedUsers from "./ProtectedUsers";
import ItemListContainer from "../components/pages/itemlist/ItemListContainer"; //
import Home from "../components/pages/home/Home"; //
import ItemDetailContainer from "../components/pages/itemDetail/ItemDetailContainer"; //

const AppRouter = () => {
  return (
    <Routes>
      {/* VISTA PARA LOS USUARIOS LOGEADOS, solamente /cart, /checkout y miscompras */}
      <Route element={<ProtectedUsers />}>
        <Route element={<Navbar />}>
          {routes.map(({ id, path, Element }) => (
            <Route key={id} path={path} element={<Element />} />
          ))}
        </Route>
      </Route>

      {/*VISTA PARA LOS USUARIOS ADMIN */}
      <Route element={<ProtectedAdmin />}>
        <Route element={<Navbar />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

      {/* VISTA PARA TODOS LOS USUARIOS LOGEADOS O NO */}
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* register  */}
      <Route path="/register" element={<Register />} />

      {/* forgot password  */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* rutas que antes estaban bloqueadas con el login pero nadie se registra antes de mirar */}
      <Route element={<Navbar />}>
        {/* home */}
        <Route path="/" element={<Home />} />
        {/* tienda */}
        <Route path="/shop" element={<ItemListContainer />} />
        {/* detalle del producto */}
        <Route path="/itemDetail/:id" element={<ItemDetailContainer />} />
      </Route>

      <Route path="*" element={<h1>Not found</h1>} />
    </Routes>
  );
};

export default AppRouter;
