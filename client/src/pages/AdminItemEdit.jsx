import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import axios from 'axios';

import { ItemEditReducer } from '../context/itemEdit-reducer';
import { Context } from '../context/_context';
import Loading from '../components/Loading';

const AdminItemEdit = () => {

    const navigate = useNavigate();

    const params = useParams(); // items/:id
    const { id: itemId } = params;

    const [name, setName] = useState('');
    const [modelName, setModelName] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [operatingSystem, setOperatingSystem] = useState('');
    const [graphicCard, setGraphicCard] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [inStock, setInStock] = useState('');

    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] = useReducer(ItemEditReducer, {
        loading: true,
        error: ''
    });

    const { state } = useContext(Context);
    const { userInfo } = state;

    useEffect(() => {
        const fetchItemData = async () => {
            try {   
                dispatch({ type: "REQUEST_ITEM_EDIT" });

                const { data } = await axios.get(
                    `https://empress-api.onrender.com/server/items/item/${itemId}`
                );

                setName(data.name);
                setModelName(data.modelName);
                setBrand(data.brand);
                setPrice(data.price);
                setOperatingSystem(data.operatingSystem);
                setGraphicCard(data.graphicCard);
                setDescription(data.description);
                setCategory(data.category);
                setImage(data.image);
                setInStock(data.inStock);

                dispatch({ type: "SUCCESS_ITEM_EDIT" });
            } catch (error) {
                dispatch({ 
                    type: "FAIL_ITEM_EDIT",
                    payload: error.res && error.res.data.message 
                        ? error.res.data.message 
                        : error.message
                })
            }
        }
        fetchItemData();
    }, [itemId]);

    const updateItemHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: "REQUEST_ITEM_UPDATE" });

            await axios.put(
                `https://empress-api.onrender.com/server/items/item/${itemId}`, {
                    _id: itemId,
                    name, modelName, brand,
                    price, operatingSystem, graphicCard,
                    description, category, image, inStock
                }, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                }
            );

            dispatch({ type: "SUCCESS_ITEM_UPDATE" });
            toast.success('Successfully Updated');
            navigate('/itemslist');
        } catch (error) {
            dispatch({ type: "FAIL_UPDATE_ITEM" });
            toast.error(error.message);
        }
    };

    const uploadImageHandler = async (e, imageFile) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            dispatch({ type: "REQUEST_UPLOAD" });

            const { data } = await axios.post(
                'https://empress-api.onrender.com/server/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        authorization: `Bearer ${userInfo.token}`,
                    }
                }
            );

            dispatch({ type: "SUCCESS_UPLOAD" });
            setImage(data.secure_url);
            toast.success('Successfully Uploaded');
        } catch (error) {
            dispatch({ type: "FAIL_UPLOAD" })
        }
    }

    return (
        <section className="px-6 py-6 md:px-[15%] 2xl:px-[20%]">
            <Helmet>
                <title>Edit Item: {itemId}</title>            
            </Helmet>
            <header className="font-semibold text-center text-lg mb-4">
                Item: {itemId}
            </header>
            <hr className="mb-4" />
            {
                loading ? (
                    <Loading />
                ) : error ? (
                    <p className="text-sm font-semibold text-center text-[#ef233c]">
                        {error}
                    </p>
                ) : (
                    <div>
                        <form onSubmit={updateItemHandler}>
                            <div className="lg:grid lg:grid-cols-3 lg:gap-x-5">
                                <div className="mb-4 lg:col-span-1">
                                    <label className="block mb-2 font-[500]">
                                        Name
                                    </label>
                                    <input 
                                        type="text"
                                        value={name}
                                        required
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-[100%] px-4 py-2 rounded-md border text-sm focus:outline-none"
                                    />
                                </div>
                                <div className="mb-4 lg:col-span-1">
                                    <label className="block mb-2 font-[500]">
                                        Model Name
                                    </label>
                                    <input 
                                        type="text" 
                                        value={modelName}
                                        required
                                        onChange={(e) => setModelName(e.target.value)}
                                        className="w-[100%] px-4 py-2 rounded-md border text-sm focus:outline-none"
                                    />
                                </div>
                                <div className="mb-4 lg:col-span-1">
                                    <label className="block mb-2 font-[500]">
                                        Brand
                                    </label>
                                    <input 
                                        type="text" 
                                        value={brand}
                                        required
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="w-[100%] px-4 py-2 rounded-md border text-sm focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="lg:grid lg:grid-cols-3 lg:gap-x-5">
                                <div className="mb-4 lg:col-span-1">
                                    <label className="block mb-2 font-[500]">
                                        Price
                                    </label>
                                    <input 
                                        type="number" 
                                        value={price}
                                        required
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-[100%] px-4 py-2 rounded-md border text-sm focus:outline-none"
                                    />
                                </div>
                                <div className="mb-4 lg:col-span-1">
                                    <label className="block mb-2 font-[500]">
                                        Operating System
                                    </label>
                                    <input 
                                        type="text" 
                                        value={operatingSystem}
                                        required
                                        onChange={(e) => setOperatingSystem(e.target.value)}
                                        className="w-[100%] px-4 py-2 rounded-md border text-sm focus:outline-none"
                                    />
                                </div>
                                <div className="mb-4 lg:col-span-1">
                                    <label className="block mb-2 font-[500]">
                                        Graphic Card
                                    </label>
                                    <input 
                                        type="text" 
                                        value={graphicCard}
                                        required
                                        onChange={(e) => setGraphicCard(e.target.value)}
                                        className="w-[100%] px-4 py-2 rounded-md border text-sm focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="lg:grid lg:grid-cols-3 lg:gap-x-5">
                                <div className="mb-4 lg:col-span-1">
                                    <label className="block mb-2 font-[500]">
                                        Category
                                    </label>
                                    <input 
                                        type="text" 
                                        value={category}
                                        required
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-[100%] px-4 py-2 rounded-md border text-sm focus:outline-none"
                                    />
                                </div>
                                <div className="mb-4 lg:col-span-1">
                                    <label className="block mb-2 font-[500]">
                                        Image
                                    </label>
                                    <input 
                                        type="text" 
                                        value={image}
                                        required
                                        onChange={(e) => setImage(e.target.value)}
                                        className="w-[100%] px-4 py-2 rounded-md border text-sm focus:outline-none"
                                    />
                                </div>
                                <div className="mb-4 lg:col-span-1">
                                    <label className="block mb-2 font-[500]">
                                        Upload Image
                                    </label>
                                    <input 
                                        type="file" 
                                        required
                                        onChange={uploadImageHandler}
                                        className="w-[100%] px-4 py-2 rounded-md border text-sm focus:outline-none"
                                    />
                                    {
                                        loadingUpload && (
                                            <p className="font-semibold text-sm text-center">
                                                Loading...
                                            </p>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="lg:grid lg:grid-cols-3 lg:gap-x-5 mb-8">
                                <div className="mb-4 lg:col-span-1">
                                    <label className="block mb-2 font-[500]">
                                        In Stock
                                    </label>
                                    <input 
                                        type="number" 
                                        value={inStock}
                                        required
                                        onChange={(e) => setInStock(e.target.value)}
                                        className="w-[100%] px-4 py-2 rounded-md border text-sm focus:outline-none"
                                    />
                                </div>
                                <div className="mb-4 lg:col-span-2">
                                    <label className="block mb-2 font-[500]">
                                        Description
                                    </label>
                                    <textarea 
                                        type="text" 
                                        value={description}
                                        required
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-[100%] h-[150px] px-4 py-2 rounded-md border text-sm focus:outline-none"
                                    ></textarea>
                                </div>
                            </div>
                            <button 
                                type="submit"
                                disabled={loadingUpdate}
                                className="px-4 py-1 mb-4 text-sm font-semibold rounded-md border hover:bg-[#4361ee] hover:text-white transition-all duration-150"
                            >
                                Update
                            </button>
                            {
                                loadingUpdate && <p>Loading</p>
                            }
                        </form>
                    </div>
                )
            }
        </section>
    )
};

export default AdminItemEdit;