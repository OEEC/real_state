import { check, validationResult } from 'express-validator'
import User from "../models/User.js"
import { generatedId } from '../helpers/tokens.js';
import {registerEmail} from '../helpers/emails.js'

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

const saveNewUSer = async (req, res) => {
    //Validations
    await check('name').notEmpty().withMessage("Name can't be empty").run(req);
    await check('email').isEmail().withMessage("it's must be an email").run(req);
    await check('password').isLength({min: 8}).withMessage("at last 8 characters").run(req);
    //this validation down dosen't work an after tryin a custom validation and other things a deciden make one manualy
    //await check('repassword').equals('password').withMessage("passwords not match").run(req);
    let result = validationResult(req);
    //Manualy validate passwords
    let matchPass = [];
    let samePassword = true;
    let notMachMessage = ""
    if(req.body.password !== req.body.repassword){
       samePassword = false
       notMachMessage = "Passwords not match"
       matchPass.push({itMatch: samePassword, msg: notMachMessage});
    }
    //if there are errors
    if(!result.isEmpty()){
        //returning errors
       return res.render('auth/register', {
            pageHeader: "Make an account",
            errors: result.array(),
            matchPass: matchPass,
            user: {
                name: req.body.name,
                email: req.body.email
            }
        });
    } else if(!samePassword) {
        return res.render('auth/register', {
            pageHeader: "Make an account",
            matchPass: matchPass,
            user: {
                name: req.body.name,
                email: req.body.email
            }
        });
    }

    //extract data
    const { name, email, password } = req.body
    //validating duplicate users
    const existUser = await User.findOne({where: { email } });
    //if user is already registeres
    if(existUser){
        //returning mesage
        return res.render('auth/register', {
            pageHeader: "Make an account",
            errors: [{ msg: "Email already registered"}],
            user: {
                name: name,
                email: email
            }
        });
    }
    //create a new user
   const user = await User.create({
        name,
        email,
        password,
        token: generatedId()
    })

    //Sending confirmation email
    registerEmail({
        nanme: user.name,
        email: user.email,
        token: user.token
    });

    //Confirmation message
    res.render('templates/message', {
        pageHeader: "Account Created",
        message: "We send a confirmation email"
    });
}

//Email confiomation
const emailConfimration = async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({where: { token } });
    if(!user){
        return res.render('auth/confirmAccount', {
            pageHeader: "Confirm Account error",
            message: "there's is an error with your activation.",
            error: true
        });
    }
    user.confirmed = true;
    user.token = "";
    await user.save();
    res.render('auth/confirmAccount', {
        pageHeader: "Account confirmed",
        message: "Your accunt as been confirmed",
        error: false
    });
}   
export {
    loginForm,
    registerForm,
    forgotPasswordForm,
    saveNewUSer,
    emailConfimration
}