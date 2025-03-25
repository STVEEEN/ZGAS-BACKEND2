// importamos las tablas de los usuarios
import customerModel from "../models/customers.js";
import employeeModel from "../models/employee.js";
import bcrypt from "bcryptjs";
import JsonWebToken from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

loginController.login = async (req, res) =>{
    const {email, password} = req.body;

    try {

    let userFound; //para guardar el usuario encontrado
    let userType; // para guardar el tipo de usuario (empleado o cliente)

    // 1. ADMIN

    if(email === config.emailAdmin.email && password === config.emailAdmin.password){
        userType = "admin",
        userFound = {_id: "admin"}
    }else{
        //2- EMPLEADO (EMPLOYEE)
        userFound = await employeeModel.findOne({email}) //Select a la tabla empleados para saber si existe ahi
        userType = "employee" // Si se encuentra significa que es empleado

        //CLIENTE (CUSTOMER)
        if(!userFound){
            userFound = await customerModel.findOne({email})
            userType = "customer"
        }
    }
    //SI EL USUARIO NO EXISTE O NO SE ENCUENTRA
    if(!userFound){
        console.log("A pesar de buscar en todos lados, el usuario no existe")
        return res.json ({message: "user not found"})
    }

    //VALIDAR LA CONTRASEÑA
    //SOLO SI NO ES ADMIN
    if(userType !== "admin"){
        //VEAMOS SI LA CONTRASEÑA QUE ESTAN ESCRIBIENDO EN EL LOGIN ES LA MISMA QUE LA QUE ESTA EN LA BASE DE DATOS(INCRIPTADA)
        const isMatch = await bcrypt.compare(password,userFound.password)
        if(!isMatch){
            return res.json({message: "la contraseña es incorrecta, escriba bien la fokin contraseña bro"})
        }

    }

    // --> TOKKEN <--

    JsonWebToken.sign(
        //1. que voy a guardar
        {id: userFound._id, userType},
        //2.Secreto
        config.JWT.secret,
        //Cuando expira
        {expiresIn: config.JWT.expiresIn},
        //Funcion flecha

        (error, token)=> {
            if (error) console.log(error)

                res.cookie("authToken", token)
                res.json({message: "login succesful"})
        }
    )

    } catch (error) {

        res.json({message: "error"})
        
    }
}

export default loginController;