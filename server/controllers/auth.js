import bcrypt from 'bcrypt';

import User from "../models/user.js";
import { generateToken } from '../utils/generateToken.js';

// Signup
export const signup = async (req, res, next) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password ) {
        res.status(422).json({
            error: "Please fill all fields"
        });
    }

    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name: name,
            email:  email,
            password: hashedPassword,
        });

        const user = await newUser.save();  

        res
            .status(200)
            .json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Login
export const login = async (req, res, next) => {
    
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('A user with this email could not be found!');
            error.statusCode = 401;
            throw error;
        };

        if (user) {
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                const error = new Error('Invalid Password!');
                error.statusCode = 401;   
                throw error;
            };
        }
        
        res
            .status(200)
            .json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};