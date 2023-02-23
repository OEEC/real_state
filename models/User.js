import { DataTypes } from "sequelize";
import db from "./config/database.js"

const User = db.define('users',{
    name:{
        type: DataTypes.STRING,
        allowNull: false 
    },
    emial:{
        type: DataTypes.STRING,
        allowNull: false 
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false 
    },
    token: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN
})

export default User;