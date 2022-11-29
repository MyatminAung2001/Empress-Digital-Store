import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;