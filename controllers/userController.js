import { check, validationResult } from 'express-validator'
import User from "../models/User.js"

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
   // await check('repassword').equals('password').withMessage("passwords not match").run(req);
    let result = validationResult(req);
    //result = result.array();
    console.log("🚀 ~ file: userController.js:31 ~ saveNewUSer ~ result:", result)
    //Manualy validate passwords
    let samePassword = true;
    let notMachMessage = ""
    if(req.body.password !== req.body.repassword){
       samePassword = false
       notMachMessage = "Passwords not match"
    }
    //if there are errors
    if(!result.isEmpty()){
        //returning errors
       return res.render('auth/register', {
            pageHeader: "Make an account",
            errors: result.array(),
            matchPass: {
                itMatch: samePassword,
                msg: notMachMessage
            },
            user: {
                name: req.body.name,
                email: req.body.email
            }
        });
    } else if(!samePassword) {
        console.log("🚀 ~ file: userController.js:50 ~ saveNewUSer ~ samePassword:", samePassword)
        return res.render('auth/register', {
            pageHeader: "Make an account",
            matchPass: {
                itMatch: samePassword,
                msg: notMachMessage
            },
            user: {
                name: req.body.name,
                email: req.body.email
            }
        });
    }
    //validating duplicate users
    const existUser = await User.findOne({where: { email: req.body.email } });
    //if user is already registeres
    // if(existUser){
    //     //returning mesage
    //     return res.render('auth/register', {
    //         pageHeader: "Make an account",
    //         errors: [{ msg: "Email already registered"}],
    //         user: {
    //             name: req.body.name,
    //             email: req.body.email
    //         }
    //     });
    // }
    // const user = await User.create(req.body)
    // res.send(user);
}

export {
    loginForm,
    registerForm,
    forgotPasswordForm,
    saveNewUSer
}