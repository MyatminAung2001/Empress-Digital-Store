import Item from "../models/item.js";

// Get All Item
export const getAllItem = async (req, res, next) => {
    try {
        const items = await Item.find();
        if (!items) {
            const error = new Error('No Items are found!');
            error.statusCode = 404;
            throw error;
        }

        res
            .status(200)
            .json(items)
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Create New Item
export const createNewItem = async (req, res, next) => {
    try {
        const newItem = new Item({
            name: 'name',
            modelName: 'modelName',
            brand: 'brand',
            price: 0,
            operatingSystem: 'operatingSystem',
            graphicCard: 'graphicCard',
            description: 'description',
            rating: 0,
            category: 'category',
            image: '/images/item1.jpg',
            inStock: 0,
            numberOfReviews: 0
        });

        const item = await newItem.save();

        res
            .status(200)
            .json({
                message: "Successfully Created",
                item
            })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Update Item
export const updateItem = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const item = await Item.findById(itemId);
        if (!item) {
            const error = new Error('No Item is found on this ID!');
            error.statusCode = 404;
            throw error;
        };

        if (item) {
            item.name = req.body.name;
            item.modelName = req.body.modelName;
            item.brand = req.body.brand;
            item.price = req.body.price;
            item.operatingSystem = req.body.operatingSystem;
            item.graphicCard = req.body.graphicCard;
            item.description = req.body.description;
            item.category = req.body.category;
            item.image = req.body.image;
            item.inStock = req.body.inStock;

            await item.save();
            
            res
                .status(200)
                .json({ message: "Item Updated" })
        };
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Delete Item
export const deleteItem = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            const error = new Error('No Item is found on this ID!');
            error.statusCode = 404;
            throw error;
        }

        if (item) {
            await item.remove();
            res
                .status(200)
                .json({
                    message: 'Successfully Deleted'
                })
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }  
        next(error);
    }
}

// Get Item Details
export const getItemDetails = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            const error = new Error('No Item is found on this ID!');
            error.statusCode = 404;
            throw error;
        }

        res
            .status(200)
            .json(item)
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Get Item Categories
export const getCategories = async (req, res, next) => {
    try {
        const categories = await Item.find().distinct('category');
        if (!categories) {
            const error = new Error('No category is found!');
            error.statusCode = 404;
            throw error;
        };

        res
            .status(200)
            .json(categories);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Search Item
const ITEMS_PER_PAGE = 6;

export const getSearchItem = async (req, res, next) => {
    try {
        const { query } = req;
        const pageSize = query.pageSize || ITEMS_PER_PAGE;
        const page = query.page || 1;
        const category = query.category || '';
        const price = query.price || '';
        const rating = query.rating || '';
        const order = query.order || '';
        const searchQuery = query.query || '';

        const filterQuery = searchQuery && searchQuery !== 'all' ? {
            name: {
                $regex: searchQuery,
                $options: 'i'
            }
        } : {};

        const filterCategory = category && category !== 'all' ? { category } : {};

        const filterRating = rating && rating !== 'all' ? {
            rating: {
                $gte: Number(rating)
            }
        } : {};

        const filterPrice = price && price !== 'all' ? {
            price: {
                $gte: Number(price.split('-')[0]),
                $lte: Number(price.split('-')[1])
            }
        } : {};

        const sortOrder = order === 'featured' ? { featured: -1 } : 
            order === 'lowest' ? { price: 1 } :
            order === 'highest' ? {price: -1 } :
            order === 'toprated' ? { rating: -1 } :
            order === 'newest' ? { createdAt: -1 } : { _id: -1 }

        const items = await Item
            .find({
                ...filterQuery,
                ...filterCategory,
                ...filterRating,
                ...filterPrice
            })
            .sort(sortOrder)
            .skip((page - 1) * pageSize)
            .limit(pageSize)

        const countItems = await Item.countDocuments({
            ...filterQuery,
            ...filterCategory,
            ...filterRating,
            ...filterPrice
        })

        res
            .status(200)
            .json({
                items,
                countItems,
                page,
                pages: Math.ceil(countItems / pageSize)
            })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Get Item List (Admin)
let ITEM_LIST_PER_PAGE = 9;

export const getItemList = async (req, res, next) => {
    try {
        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || ITEM_LIST_PER_PAGE;

        const itemList = await Item
            .find()
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const countItemList = await Item.countDocuments();

        res
            .status(200)
            .json({
                itemList,
                countItemList,
                page,
                pages: Math.ceil(countItemList / pageSize)
            })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Post Reviews
export const postReview = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const item = await Item.findById(itemId);

        if (!item) {
            const error = new Error('No item is found on this ID!');
            error.statusCode = 404;
            throw error;
        };

        if (item) {
            if (item.reviews.find((client) => client.name === req.user.name)) {
                return res
                    .status(400)
                    .json({
                        message: "You have already submitted a review"
                    })
            }

            const review = {
                name: req.user.name,
                rating: Number(req.body.rating),
                comment: req.body.comment,
            };

            item.reviews.push(review);
            item.numberOfReviews = item.reviews.length;
            item.rating = item.reviews.reduce((accu, curRate) => curRate.rating + accu, 0) / item.reviews.length;

            const updateItem = await item.save();
            res
                .status(200)
                .json({
                    message: "Post Review",
                    review: updateItem.reviews[updateItem.reviews.length - 1],
                    numberOfReviews: item.numberOfReviews,
                    rating: item.rating
                })
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};