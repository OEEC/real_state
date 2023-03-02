import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt';
import User from "../models/User.js"
import { generatedId, generateJWT } from '../helpers/tokens.js'
import {registerEmail, recoveriPasswordEmail} from '../helpers/emails.js'

//---------- Views --------------------//
//Login view
const loginForm = (req, res) => {
    res.render('auth/login', {
        pageHeader: "Login",
        csrf: req.csrfToken(),
    });
}
//register view
const registerForm = (req, res) => {
    res.render('auth/register', {
        pageHeader: "Make an account",
        csrf: req.csrfToken()
    });
}

//forgotten password view
const forgotPasswordForm = (req, res) => {
    res.render('auth/forgotPassword', {
        pageHeader: "Recover password",
        csrf: req.csrfToken(),
    });
}

//---------------- Login functions -----------------------///

const authenticateUser = async (req, res) => {
    //Validations
    await check('email').isEmail().withMessage("Email is required").run(req);
    await check('password').notEmpty().withMessage("Password is required").run(req);
    let result = validationResult(req);
    //if there are errors
    if(!result.isEmpty()){
        //returning errors
        return res.render('auth/login', {
            pageHeader: "Login",
            errors: result.array(),
            csrf: req.csrfToken(),
            user: {
                email: req.body.email
            }
        });
    }
    //extract data
    const { email, password } = req.body
    //validating user
    const user = await User.findOne({where: { email } });

    if(!user){
      //returning mesage
      return res.render('auth/login', {
        pageHeader: "Login",
          errors: [{ msg: "User don't exist"}],
          csrf: req.csrfToken(),
          user: {
              email: email
          }
      });
   }
   //Validate if user is confirmed
   if(user.confirmed != 1){
    //returning mesage
    return res.render('auth/login', {
      pageHeader: "Login",
        errors: [{ msg: "You need to confirm your account"}],
        csrf: req.csrfToken(),
        user: {
            email: email
        }
    });
  }
  //Validate if is the same password
 const validatePassowrd = bcrypt.compareSync(password, user.password);
  // const validatePassowrd = user.verificatePassword(password, user.password)
   console.log('validatePassowrd: ',validatePassowrd);
  if(!validatePassowrd){
    return res.render('auth/login', {
      pageHeader: "Login",
        errors: [{ msg: "Invalid Password"}],
        csrf: req.csrfToken(),
        user: {
            email: email
        }
    });
  }
  // authenticate user
  const token = generateJWT(user.id);

  //Store cookie
  return res.cookie('_token', token,{
    httpOnly: true,
    //secure: true
    //sameSite: true
  }).redirect('/properties/myProperties');
}

//------------- Regitser User functions -----------------------------//
//register user action
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
            csrf: req.csrfToken(),
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
            csrf: req.csrfToken(),
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
            csrf: req.csrfToken(),
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

//Email confirmation
const emailConfirmation = async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({where: { token } });
    if(!user){
        return res.render('auth/confirmAccount', {
            pageHeader: "Confirm Account error",
            message: "there's an error with your activation, try later.",
            error: true
        });
    }
    user.confirmed = true;
    user.token = null;
    await user.save();
    res.render('auth/confirmAccount', {
        pageHeader: "Account confirmed",
        message: "Your accunt as been confirmed",
        error: false
    });
}

//------------- Recovery password functions -------------------------------//
//forgot password action send email
const forgotPassword = async (req, res) => {
    //validate if is an email
    await check('email').isEmail().withMessage("it's must be an email").run(req);
    let result = validationResult(req);
    //if there are errors
    if(!result.isEmpty()){
        //returning errors
        return res.render('auth/forgotPassword', {
            pageHeader: "Recover password",
            errors: result.array(),
            csrf: req.csrfToken(),
            user: {
                email: req.body.email
            }
        });
    }
    //extract data
    const { email } = req.body
    //search if email exist
    const user = await User.findOne({ where: { email }})
    //if not exist return error
    if(!user){
        //returning mesage
        return res.render('auth/forgotPassword', {
            pageHeader: "Recover password",
            errors: [{ msg: "EMAIL "+ email + " IS NOT REGISTED"}],
            csrf: req.csrfToken(),
            user: {
                email: email
            }
        });
    }

    //generate token and send email
    user.token = generatedId();
    await user.save();
    
    //send reset password email
    recoveriPasswordEmail({
        name: user.name,
        email: user.email,
        token: user.token
    });

    //Confirmation message
    res.render('templates/message', {
        pageHeader: "Reset Password",
        message: "We send you a reset's password email with instructions"
    });
}

//validate reset password email token
const validateToken = async (req, res) => {
    const {token} = req.params;
    const user = await User.findOne({ where:{ token } });
    if(!user){
        return res.render('auth/confirmAccount', {
            pageHeader: "Reset Password",
            message: "there's must be an error with your reset password, try later.",
            error: true
        });
    }
    res.render('auth/resetPassword',{
        pageHeader: "Reset Password",
        csrf: req.csrfToken(),
    })

}

// save new password on a user
const resetPassword = async (req, res) => {
    //validate password
    await check('password').isLength({min: 8}).withMessage("at last 8 characters").run(req);
    let result = validationResult(req);
    //Manualy validate passwords
    let matchPass = [];
    let samePassword = true;
    let notMachMessage = ""
    if(req.body.password !== req.body.rePassword){
       samePassword = false
       notMachMessage = "Passwords not match"
       matchPass.push({itMatch: samePassword, msg: notMachMessage});
    }
    //if there are errors
    if(!result.isEmpty()){
        //returning errors
        return res.render('auth/resetPassword', {
            pageHeader: "Reset Password",
            errors: result.array(),
            csrf: req.csrfToken(),
            matchPass: matchPass,
            user: {
                email: req.body.email
            }
        });
    } else if(!samePassword) {
        return res.render('auth/resetPassword', {
            pageHeader: "Reset Password",
            matchPass: matchPass,
            csrf: req.csrfToken(),
            user: {
                email: req.body.email
            }
        });
    }
    //extract data
    const { token } = req.params
    const { password } = req.body
    //Hashig new password
    const user = await User.findOne({ where:{ token } });
    const salt = await bcrypt.genSalt(10)
    User.password = await bcrypt.hash(password, salt);
    user.token = null

    //Save User
    await user.save();
    return res.render('auth/confirmAccount', {
        pageHeader: "Password reset",
        message: "Your password as been reset to the new password.",
        error: false
    });
    
}


export {
    loginForm,
    registerForm,
    forgotPasswordForm,
    saveNewUSer,
    emailConfirmation,
    forgotPassword,
    validateToken,
    resetPassword,
    authenticateUser
}