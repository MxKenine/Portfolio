import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    avatar: {type: String},
    phone: {type: String},
    where: {type : String},
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true, minLenght: 6 },
    role: { type: String, enum: ["user", "admin"], required: true},
    isActive: { type: Boolean, default: false },
    token: {type: String, required: true}
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User