const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
    },
    mobile:{
        type: Number
    },
    email:{
        type: String,
        unique: true
    },
    address:{
        type: String,
        require: true
    },
    aadharCardNumber:{
        type: Number,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    role:{
        type: String,
        enum: ['admin', 'voter'],
        default: 'voter'
    },
    isVoted:{
        type: Boolean,
        default: false 
    }
});

userSchema.pre('save', async function(next){

    const user = this;

    if(!user.isModified('password')) return next();
    try{
        //hash password generation
        const salt = await bcrypt.genSalt(10);

        //hash password
        const hashedPassword = await bcrypt.hash(user.password, salt);

        //overwrite the plainpassword with hash password
        user.password = hashedPassword;

        next();
    }catch(err){
         return next(err);
    }
})


userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

const user = mongoose.model('user', userSchema);
module.exports = user;