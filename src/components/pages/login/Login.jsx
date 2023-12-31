import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useContext, useState } from "react";
import { db, loginGoogle, onSigIn } from "../../../firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";

const Login = () => {
  const { handleLogin } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  /*   const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("El campo debe ser un email")
        .required("Este campo es obligatorio"),
      password: Yup.string()
        .required("Este campo es obligatorio")
        .matches(/^(?=.*[a-z]).{6,15}$/, {
          message:
            "La contraseña debe tener 6 caracteres como mínimo y 15 como máximo, en minusculas",
        }),
    }),
    onSubmit: async (values) => {
      try {
        const res = await onSigIn(values);
        console.log(res);
        if (res.user) {
          const userCollection = collection(db, "users");
          const userRef = doc(userCollection, res.user.uid);
          const userDoc = await getDoc(userRef); //usuario de la base de datos
          let finalyUser = {
            email: res.user.email,
            rol: userDoc.data().rol,
          };
          //console.log("usuario:", finalyUser);
          handleLogin(finalyUser); //el usuario logeado
          console.log(nick);
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    },
  }); */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await onSigIn(userCredentials);
      if (res.user) {
        const userCollection = collection(db, "users");
        const userRef = doc(userCollection, res.user.uid);
        const userDoc = await getDoc(userRef); //usuario de la base de datos
        let finalyUser = {
          email: res.user.email,
          rol: userDoc.data().rol,
        };
        //console.log("usuario:", finalyUser);
        handleLogin(finalyUser); //el usuario logeado
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const googleSignIn = async () => {
    const res = await loginGoogle();
    let finalyUser = {
      email: res.user.email,
      rol: "user",
    };
    handleLogin(finalyUser); //el usuario logeado
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        // backgroundColor: theme.palette.secondary.main,
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid
          container
          rowSpacing={2}
          // alignItems="center"
          justifyContent={"center"}
        >
          <Grid item xs={10} md={12}>
            <TextField
              name="email"
              label="Email"
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={10} md={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">
                Contraseña
              </InputLabel>
              <OutlinedInput
                onChange={handleChange}
                name="password"
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff color="primary" />
                      ) : (
                        <Visibility color="primary" />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Contraseña"
              />
            </FormControl>
          </Grid>
          <Link
            to="/forgot-password"
            style={{ color: "steelblue", marginTop: "10px" }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <Grid container justifyContent="center" spacing={3} mt={2}>
            <Grid item xs={10} md={5}>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{
                  color: "white",
                  textTransform: "none",
                  textShadow: "2px 2px 2px grey",
                }}
              >
                Iniciar sesion
              </Button>
            </Grid>
            <Grid item xs={10} md={5}>
              <Tooltip title="Iniciar sesion con Google">
                <Button
                  variant="contained"
                  startIcon={<GoogleIcon />}
                  onClick={googleSignIn}
                  type="button"
                  fullWidth
                  sx={{
                    color: "white",
                    textTransform: "none",
                    textShadow: "2px 2px 2px grey",
                  }}
                >
                  Iniciar sesion con google
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={10} md={8}>
              <Typography
                color={"secondary.primary"}
                variant={"h6"}
                mt={1}
                align="center"
              >
                ¿Aun no tienes cuenta?
              </Typography>
            </Grid>
            <Grid item xs={10} md={5}>
              <Tooltip title="Registrarse">
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/register")}
                  type="button"
                  sx={{
                    color: "white",
                    textTransform: "none",
                    textShadow: "2px 2px 2px grey",
                  }}
                >
                  Registrarse
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Login;
