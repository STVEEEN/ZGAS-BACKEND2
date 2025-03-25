import express from "express";
import customersControllers from "../controllers/registerEmployeesController.js";
const router = express.Router();

router
  .route("/")
  .post(customersControllers.register);

export default router;