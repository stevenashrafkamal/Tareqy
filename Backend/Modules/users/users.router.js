import { Router } from "express";
import { signUp, signIn, verifyAccount, getMe, getAllUsers, deleteUser, updateUser, addAdmin } from "./users.controller.js";
import { validate } from "../../Middlewares/validate.js";
import { signupValidation, loginValidation, updateProfileValidation } from "../../validation/user.validation.js";
import { hashPass } from "../../Middlewares/hashpass.js";
import { checkSignin } from "../../Middlewares/checkEmail.js";
import { checkToken } from "../../Middlewares/checkToken.js";
import upload from "../../Middlewares/multer.js";
import { checkAdmin } from "../../Middlewares/checkAdmin.js";

export const userRouter = Router();

userRouter.post("/signup", validate(signupValidation), hashPass, signUp);
userRouter.post("/signin", validate(loginValidation), checkSignin, signIn);
userRouter.get("/verify/:token", verifyAccount);
userRouter.get("/me", checkToken, getMe);
userRouter.get("/all", checkToken, checkAdmin, getAllUsers);
userRouter.post("/add-admin", checkToken, checkAdmin, hashPass, addAdmin);
userRouter.delete('/:id', checkToken, checkAdmin, deleteUser);
userRouter.put("/update", checkToken, upload.single("image"), validate(updateProfileValidation), updateUser);
