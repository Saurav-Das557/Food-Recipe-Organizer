import express from "express";
import { isAdmin, requireSignIn } from "../middleWares/authMiddleWare.js";
import { getAllUsersController, getInfoController, makeUserAdminController } from "../controllers/userController.js";

const router = express.Router();

//get review
router.get("/get-info/:id", requireSignIn, isAdmin, getInfoController);

// get all user
router.get("/get-all-users", requireSignIn, isAdmin, getAllUsersController);

// update user status
router.put("/make-admin/:id", requireSignIn, isAdmin, makeUserAdminController)

// delete review
// router.delete("/reviews/:reviewId", requireSignIn, deleteReviewController);

// // get name
// router.get("/get-name", requireSignIn, getNameController);

export default router;
