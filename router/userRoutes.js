
import express from "express";
import { loginForm, registerForm, forgotPasswordForm, saveNewUSer, emailConfimration } from "../controllers/userController.js";

const router = express.Router();

router.get('/login', loginForm);
router.get('/register', registerForm);
router.post('/register', saveNewUSer);
router.get('/forgotPassword', forgotPasswordForm);
router.get('/confirmEmail/:token', emailConfimration);

export default router