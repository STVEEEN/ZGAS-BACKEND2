// Importo todo lo de la libreria de Express
import express from "express";
import productsRoutes from "./src/routes/products.js";
import customersRoutes from "./src/routes/customers.js";
import employeeRoutes from "./src/routes/employees.js";
import branchesRoutes from "./src/routes/branches.js";
import reviewRoutes from "./src/routes/reviews.js";
import register from "./src/routes/register.js";
import cookieParser from "cookie-parser";
import loginRouter from "./src/routes/login.js"
import logout from "./src/routes/logout.js"
import registerClient from "./src/routes/registerClient.js"

// Creo una constante que es igual a la libreria que importé
const app = express();

//Que acepte datos en json
app.use(express.json());
//Que acepten cookies en postman
app.use(cookieParser());

// Definir las rutas de las funciones que tendrá la página web
app.use("/api/products", productsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/registerEmpleoyees",register);
app.use("/api/login", loginRouter);
app.use("/api/logout", logout);

app.use("/regissterClients", registerClient)

// Exporto la constante para poder usar express en otros archivos
export default app;