import express from "express";
import {
  registerController,
  loginController,
  testController,
} from "../controllers/authController.js";

import { isAdmin, requireSignIn } from "../middleWares/authMiddleWare.js";

// router object
const router = express.Router();

// routing
// Register || Method Post
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.send(200).send({ ok: true });
});

export default router;
