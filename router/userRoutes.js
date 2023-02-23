
import express from "express";
import { loginForm, registerForm, forgotPasswordForm, saveNewUSer } from "../controllers/userController.js";

const router = express.Router();

router.get('/login', loginForm);
router.get('/register', registerForm);
router.get('/forgotPassword', forgotPasswordForm);
router.post('/newUser', saveNewUSer);

export default router