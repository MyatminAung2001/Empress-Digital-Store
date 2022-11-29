import bcrypt from 'bcrypt';

import User from "../models/user.js";
import { generateToken } from '../utils/generateToken.js';

// Get All Users (Admin)
let USER_LIST_PER_PAGE = 9;

export const getAllUsers = async (req, res, next) => {
    try {
        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || USER_LIST_PER_PAGE;

        const usersList = await User
            .find()
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const countUsersList = await User.countDocuments();

        res
            .status(200)
            .json({
                usersList,
                countUsersList,
                page,
                pages: Math.ceil(countUsersList / pageSize)
            })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Delete User (Admin)
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            const error = new Error('A user with this ID could not be found!');
            error.statusCode = 401;
            throw error;
        }

        if (user) {
            if (user.email === 'admin@admin.com') {
                res
                    .status(400)
                    .json({
                        message: "Unable to delete Admin Account!"
                    })
            };
            await user.remove();

            res
                .status(200)
                .json({
                    message: "Successfully Deleted!"
                })
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Update Profile 
export const updateProfle = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            const error = new Error('A user with this ID could not be found!');
            error.statusCode = 401;
            throw error;
        }

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password === bcrypt.hashSync(req.body.password, 12);
            }
            const updatedUser = await user.save();
            res
                .status(200)
                .json({
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    isAdmin: updatedUser.isAdmin,
                    token: generateToken(updatedUser)
                })
        }

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};