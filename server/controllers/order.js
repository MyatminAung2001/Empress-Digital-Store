import User from "../models/user.js";
import Order from "../models/order.js";
import Item from "../models/item.js";
// import { MailGun, sendOrderEmailTemplate } from "../utils/sendMail.js";

// Post Order
export const postOrder = async (req, res, next) => {
    try {
        const newOrder = new Order({
            orderItems: req.body.orderItems.map((x) => ({ ...x, item: x._id })),
            deliveryAddress: req.body.deliveryAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            deliveryPrice: req.body.deliveryPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user._id
        });

        const order = await newOrder.save();

        res
            .status(200)
            .json({
                success: true,
                order
            })
    } catch(error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Get Order List (Admin)
let ITEM_LIST_PER_PAGE = 9;
export const getOrderList = async (req, res, next) => {
    try {
        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || ITEM_LIST_PER_PAGE;

        const ordersList = await Order
            .find()
            .populate('user', 'name')
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const countOrdersList = await Order.countDocuments();
        
        res
            .status(200)
            .json({
                ordersList,
                countOrdersList,
                page,
                pages: Math.ceil(countOrdersList / pageSize)
            });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

// Get Order Detail
export const getOrderDetail = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            const error = new Error('No order is found on this ID!');
            error.statusCode = 404;
            throw error;
        }

        res
            .status(200)
            .json(order);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500; 
        }
        next(error);
    }
};

// Get Order History   
export const getOrderHistory = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        if (!orders) {
            const error = new Error('No order is found on this User!');
            error.statusCode = 404;
            throw error;
        }

        res
            .status(200)
            .json(orders);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Order Payment
export const orderPayment = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'email name')
        if (!order) {
            const error = new Error('No order is found on this ID!');
            error.statusCode = 404;
            throw error;
        };

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email: req.body.email
            }
        };

        const updateOrder = await order.save();

        // MailGun().messages().send({
        //     from: 'Express <empress@mg.sandboxa8e3f5993cc34da3b6533853c3715926.mailgun.org.com>',
        //     to: `${order.user.name} <${order.user.email}>`,
        //     subject: `New Order ${order._id}`,
        //     html: sendOrderEmailTemplate(order)
        // }, (error, body) => {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log(body);
        //     }
        // } )

        res
            .status(200)
            .json({
                message: "Successfully Paid",
                order: updateOrder
            })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Get All Order Summary (Admin)
export const getOrderSummary = async (req, res, next) => {
    try {
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalSales: { $sum: '$totalPrice' }
                }
            }
        ]);

        const users = await User.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 }
                }
            }
        ]);

        const dailyOrders = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    orders: { $sum: 1 },
                    sales: { $sum: '$totalPrice' },
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const itemCategories = await Item.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        res
            .status(200)
            .json({
                orders,
                users,
                dailyOrders,
                itemCategories
            })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Deliver Order (Admin)
export const deliverOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            const error = new Error('No order is found on this ID!');
            error.statusCode = 404;
            throw error;
        };

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            await order.save();
            
            res
                .status(200)
                .json({
                    message: "Success Deliver"
                })
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Delete Order (Admin)
export const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            const error = new Error('No order is found on this ID!');
            error.statusCode = 404;
            throw error;
        };

        if (order) {
            await order.remove();
            res
                .status(200)
                .json({
                    message: "Deleted Successfully",
                })
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};