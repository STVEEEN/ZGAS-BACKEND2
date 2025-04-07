import dotenv from "dotenv";
 
//Ejecutar la libreria dotenv
// para acceder al archivo .env
dotenv.config();
 
export const config = {
  db: {
    URI: process.env.DB_URI || "mongodb://localhost:27017/ZGasDB",
  },
  server: {
    port: process.env.PORT || 4000,
  },
  JWT: {
    secret: process.env.JWT_SECRET || "secrero123",
    expireIn: process.env.JWT_EXPIRES1 || "30d"
  },
  emailAdmin: {
    email: process.env.ADMIN_EMAIL || "bryan@gmail.com",
    password: process.env.ADMIN_PASSWORD || "lamineyamal321",
  },
  email: {
    email_user: process.env.EMAIL_USER,
    email_pass: process.env.EMAIL_PASS,
  }
};
 
 