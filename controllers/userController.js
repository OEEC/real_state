//import User from "../models/User.js"

const loginForm = (req, res) => {
    res.render('auth/login', {
        pageHeader: "Login"
    });
}

const registerForm = (req, res) => {
    res.render('auth/register', {
        pageHeader: "Make an account"
    });
}

const forgotPasswordForm = (req, res) => {
    res.render('auth/forgotPassword', {
        pageHeader: "Recover password "
    });
}

const saveNewUSer = (req, res) => {
    console.log(req.body);
}

export {
    loginForm,
    registerForm,
    forgotPasswordForm,
    saveNewUSer
}