import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";

import { Link, useNavigate, Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { menuItems } from "../../../router/navigation";
import { logout } from "../../../firebaseConfig";

import style from "./Navbar.module.css";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";

const drawerWidth = 200;

function Navbar(props) {
  const { logoutContext, user, isLogged } = useContext(AuthContext);
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    if (!isLogged) {
      //iniciar sesion
      navigate("/login");
    } else {
      //cerrar sesion
      Swal.fire({
        position: "top",
        title: "Sesion cerrada correctamente",
        icon: `success`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
      });
      logout();
      logoutContext();
      navigate("/login");
    }
  };

  const drawer = (
    <div>
      <Toolbar className={style.containerToolbar} />

      <List className={style.containerList}>
        {menuItems.map(({ id, path, title, Icon }) => {
          return (
            <Link key={id} to={path}>
              <ListItem disablePadding className={style.containerMenuDrawer}>
                <ListItemButton>
                  <ListItemIcon>
                    <Icon sx={{ color: "whitesmoke" }} />
                  </ListItemIcon>
                  <ListItemText primary={title} sx={{ color: "whitesmoke" }} />
                  {/*color letras drawer*/}
                </ListItemButton>
              </ListItem>
            </Link>
          );
        })}

        {/* vista dashboard solo para el admin */}
        {user.rol === rolAdmin && (
          <Link to={"/dashboard"}>
            <ListItem disablePadding className={style.containerMenuDrawer}>
              <ListItemButton>
                <ListItemIcon>
                  <DashboardCustomizeIcon sx={{ color: "whitesmoke" }} />
                </ListItemIcon>
                <ListItemText
                  primary={"Dashboard"}
                  sx={{ color: "whitesmoke" }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        )}

        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "whitesmoke" }} />
            </ListItemIcon>
            <ListItemText
              primary={!isLogged ? "Iniciar sesion" : "Cerrar sesion"}
              sx={{ color: "whitesmoke" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box className={style.backgroundAllPage}>
      {/*box: fondo de pagina*/}
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            gap: "20px",
            display: "flex",
            justifyContent: "space-between",
            background: "rgb(241, 168, 115)",
          }}
        >
          {/*toolbar: fondo del navbar*/}
          <Link to="/" style={{ color: "whitesmoke" }}>
            Tienda Lika
          </Link>
          <IconButton
            color="secondary.primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon color="secondary.primary" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="nav" aria-label="mailbox folders">
        <Drawer
          className={style.drawer} //sombra al abrir drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          anchor={"right"}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "rgb(241, 168, 115)", //fondo del drawer
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          width: "100%",
          minHeight: "100vh",
          px: 2,
        }}
      >
        <Toolbar />

        <Outlet />
      </Box>
    </Box>
  );
}

export default Navbar;
