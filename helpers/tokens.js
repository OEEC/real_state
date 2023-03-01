import jwt from 'jsonwebtoken'

//jwt generator
const generateJWT = (id) => {
    jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '1d'
      });
}

//user token generator
const generatedId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generatedId,
    generateJWT
}