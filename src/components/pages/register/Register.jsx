import { Box, Button, Grid, TextField } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { signUp, db } from "../../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

import { useFormik } from "formik";
import * as Yup from "yup";

const Register = () => {
  const navigate = useNavigate();

  /*   const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  }); */

  /*   const handleChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  }; */

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Este campo es obligatorio")
        .min(3, "El nombre debe tener como minimo 3 caracteres"),
      email: Yup.string()
        .email("El campo debe ser un email")
        .required("Este campo es obligatorio"),
      password: Yup.string()
        .required("Este campo es obligatorio")
        .matches(/^(?=.*[a-z]).{6,15}$/, {
          message:
            "La contraseña debe tener 6 caracteres como mínimo y 15 como máximo, en minusculas",
        }),
      confirmPassword: Yup.string()
        .required("Este campo es obligatorio")
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        let res = await signUp(values);
        console.log(res);
        //para que cuando un usuario se registre siempre sea con el rol "user"
        if (res.user.uid) {
          await setDoc(doc(db, "users", res.user.uid), {
            rol: "user",
            email: res.user.email,
            name: values.name,
          }); //a futuro poner nombre o nick asi tambien se guarda en firebase el nick el rol y el email, asi podria poner bienvenido "nick" etc
        }
        //taria para poner un alert que diga que te registarte con exito
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    },
  });

  const nickk = formik.values.name;
  console.log(nickk);

  /*   const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await signUp(userCredentials);
    //console.log(res);
    //para que cuando un usuario se registre siempre sea con el rol "user"
    if (res.user.uid) {
      await setDoc(doc(db, "users", res.user.uid), {
        rol: "user",
        email: res.user.email,
      }); //a futuro poner nombre o nick asi tambien se guarda en firebase el nick el rol y el email, asi podria poner bienvenido "nick" etc
    } //taria para poner un alert que diga que te registarte con exito
    navigate("/login");
  };
 */

  console.log(formik.errors);

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
      <form onSubmit={formik.handleSubmit}>
        <Grid
          container
          rowSpacing={2}
          // alignItems="center"
          justifyContent={"center"}
        >
          <Grid item xs={10} md={12}>
            <TextField
              name="name"
              value={formik.values.name}
              label="Nombre o Nick"
              fullWidth
              onChange={formik.handleChange}
              error={formik.errors.name ? true : false}
              helperText={formik.errors.name}
            />
          </Grid>
          <Grid item xs={10} md={12}>
            <TextField
              name="email"
              value={formik.values.email}
              label="Email"
              fullWidth
              onChange={formik.handleChange}
              error={formik.errors.email ? true : false}
              helperText={formik.errors.email}
            />
          </Grid>
          <Grid item xs={10} md={12}>
            <TextField
              label="Contraseña"
              onChange={formik.handleChange}
              name="password"
              error={formik.errors.password ? true : false}
              helperText={formik.errors.password}
            />
          </Grid>
          <Grid item xs={10} md={12}>
            <TextField
              label="Confirmar contraseña"
              onChange={formik.handleChange}
              name="confirmPassword"
              error={formik.errors.confirmPassword ? true : false}
              helperText={formik.errors.confirmPassword}
            />
          </Grid>
          <Grid container justifyContent="center" spacing={3} mt={2}>
            <Grid item xs={10} md={7}>
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
                Registrarme
              </Button>
            </Grid>
            <Grid item xs={10} md={7}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate("/login")}
                type="button"
              >
                Regresar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Register;
