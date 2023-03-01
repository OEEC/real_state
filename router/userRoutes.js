
import express from "express";
import { loginForm, registerForm, forgotPasswordForm, saveNewUSer, 
    emailConfirmation, forgotPassword,validateToken, resetPassword,
    authenticateUser } from "../controllers/userController.js";

const router = express.Router();
//login
router.get('/login', loginForm);
router.post('/authenticate', authenticateUser);
//register user
router.get('/register', registerForm);
router.post('/register', saveNewUSer);
router.get('/confirmEmail/:token', emailConfirmation);
//forgotpassword
router.get('/forgotPassword', forgotPasswordForm);
router.post('/forgotPassword', forgotPassword);
router.get('/forgotPassword/:token', validateToken);
router.post('/forgotPassword/:token', resetPassword);


export default router