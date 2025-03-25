import employeeModel from "../models/employee.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import {config} from "../config.js";


const registerEmpleoyeesController = {};

registerEmpleoyeesController.register = async (req, res) =>{
    const {name, lastname, birthday, email, address, password, hireDate, telephone, dui, isVerified, issnumber} = req.body;

    try {
        //Verificamos si el empleado ya existe
        const existEmpleoyee = await employeeModel.findOne({email})
        if(existEmpleoyee) {
            return res.json ({message: "Empleado ya existe"})
        }

        //Encriptar la contraseña
        const passwordHash = await bcryptjs.hash(password, 10)

        //Guardemos el empleado muerto 
        const newEmployee = new employeeModel({name,
            lastname,
            birthday, 
            email, 
            address, 
            password,
            hireDate, 
            telephone,
            dui, 
            isVerified, 
            issnumber})

            await newEmployee.save();

            //TOKEN
            jsonwebtoken.sign(
                //1- Que voy a guardar 
                {id: newEmployee._id}, 
                //2- secreto
                config.JWT.secret,
                //3- Cuando expira
                {expiresIn: config.JWT.expireIn},
                //4- Funcion flecha
                (error, token) => {
                    if(error) console.log(error)
                        res.cookie("authToken", token)
                        res.json({message: "empleado registrado"})
                }
            );

    } catch (error) {
        console.log(error);
    }
};

export default registerEmpleoyeesController;
