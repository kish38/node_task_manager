const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
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
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'kkn12345')
    user.tokens = user.tokens.concat({token})
    user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, pwd)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error("No User found with email " + email)
    }

    const isMatch = await bcrypt.compare(pwd, user.password)
    if (!isMatch){
        throw new Error("Invalid Credentials")
    }
    return user
}

// Hashing plain password to hash string
userSchema.pre('save', async function(next){
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
