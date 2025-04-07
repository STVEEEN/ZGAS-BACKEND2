import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

import customerModel from "../models/Customers.js";
import { config } from "../config.js";

const registerCustomersController = {};

registerCustomersController.register = async (req, res) => {
    const {
        nombre,
        descripcion,
        precio,
        stock,
        email,
        password,
        telephone,
        dui,
        isVerified
    } = req.body; 

    try {
        const existingCustomer = await customerModel.findOne({ email });
        if (existingCustomer) {
            return res.json({ message: "Already Exists" });
        }

        const passwordHash = await bcryptjs.hash(password, 11);
        const newCustomer = new customerModel({
            nombre,
            descripcion,
            precio,
            stock,
            email,
            password: passwordHash,
            telephone,
            dui: dui || null,
            isVerified: isVerified || null
        });
        await newCustomer.save();

        const verificationCode = crypto.randomBytes(3).toString("hex"); 
        const tokenCode = jsonwebtoken.sign(
            { email, verificationCode },
            config.JWT.secret,
            { expiresIn: "2h" }
        );
        res.cookie("verificationToken", tokenCode, { maxAge: 2 * 60 * 60 * 1000 });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.nodemailer.user,
                pass: config.nodemailer.pass,
            }
        });

        const mailOptions = {
            from: config.nodemailer.user,
            to: email,
            subject: "Verificación de correo",
            html: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Verificación de Cuenta</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
    }
    .email-container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
    }
    h1 {
        color: #007BFF;
    }
    p {
        font-size: 16px;
        color: #333333;
    }
    .verification-code {
        font-size: 24px;
        font-weight: bold;
        color: #007BFF;
        margin: 20px 0;
    }
    .footer {
        margin-top: 30px;
        font-size: 14px;
        color: #aaaaaa;
    }
</style>
</head>
<body>
<div class="email-container">
<h1>¡Verifica tu cuenta!</h1>
<p>Hola ${nombre},</p>
<p>Gracias por registrarte. Tu código de verificación es:</p>
<div class="verification-code">${verificationCode}</div>
<p>Por favor, usa este código para completar el proceso de verificación.</p>
<p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
<div class="footer">
<p>Equipo de Soporte</p>
</div>
</div>
</body>
</html>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.json({ message: "Error sending email: " + error });
            }
            console.log("Email sent: " + info.response);
        });

        res.json({ message: "Customer registered, Please verify your account with the code from your email" });

    } catch (error) {
        console.log(error);
    }
};

registerCustomersController.verifyCodeEmail = async (req, res) => {
    const { requireCode } = req.body;
    const token = req.cookies.verificationToken; // Accessing cookie properly
    try {
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);
        const { email, verificationCode: storedCode } = decoded;

        if (requireCode !== storedCode) {
            return res.json({ message: "Invalid code" });
        }

        const customer = await customerModel.findOne({ email });
        customer.isVerified = true;
        await customer.save();

        res.clearCookie("verificationToken");
        res.json({ message: "Email verified successfully" });
    } catch (error) {
        console.log(error);
    }
};

export default registerCustomersController;
