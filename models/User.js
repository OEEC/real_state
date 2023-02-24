import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';
import db from "../config/database.js"

const User = db.define('users',{
    name:{
        type: DataTypes.STRING,
        allowNull: false 
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false 
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false 
    },
    token: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN
}, {
    hooks: {
        //hashing password before save
        beforeCreate: async (User) =>{
            const salt = await bcrypt.genSalt(10)
            User.password = await bcrypt.hash(User.password, salt);
        }
    }
})

export default User;