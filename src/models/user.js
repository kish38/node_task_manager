const mongoose = require("mongoose")
const validator = require("validator")

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    age:{
        type: Number,
        default: 18,
        validate(value){
            if (value < 18){
                throw new Error("Age must be 18+")
            }
        }
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address")
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contains "password"')
            }
        }
    }
})

module.exports = User
