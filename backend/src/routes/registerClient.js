import express from "express";
import registerClientController from "../controllers/registerClientController.js"

const router = express.Router();

router.route("/").post();

router.route("/api/verifyCodeEmail").post();
router.route(registerClientController.verifyCodeEmail);

export default router;