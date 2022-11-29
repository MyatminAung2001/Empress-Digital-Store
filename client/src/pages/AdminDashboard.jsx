import React, { useContext, useReducer, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Chart from 'react-google-charts';
import axios from 'axios';

import { Context } from '../context/_context';
import { DashBoardReducer } from '../context/DashboardReducer';
import Loading from '../components/Loading';

const AdminDashboard = () => {

    const [{ loading, summary, error}, dispatch] = useReducer(DashBoardReducer, {
        loading: true,
        error: ''
    });

    const { state } = useContext(Context);
    const { userInfo } = state;

    useEffect(() => {
        const fetchDasboardData = async () => {
            try {
                dispatch({ type: "REQUEST_DASHBOARD_DATA" });

                const { data } = await axios.get(
                    'https://empress-api.onrender.com/server/orders/summary', {
                        headers: { authorization: `Bearer ${userInfo.token}` }
                    }
                );

                dispatch({
                    type: "SUCCESS_DASHBOARD_DATA",
                    payload: data
                })
            } catch (error) {
                dispatch({
                    type: "FAIL_DASHBOARD_DATA",
                    payload: error.res && error.res.data.message 
                        ? error.res.data.message 
                        : error.message
                })
            }
        };
        fetchDasboardData();
    }, [userInfo])

    return (
        <section className="px-6 py-6 md:px-[15%] 2xl:px-[20%]">
            <Helmet>
                <title>Admin Panel</title>
            </Helmet>
            <header className="font-semibold text-lg text-center mb-4">
                Admin Dashboard
            </header>
            <hr className="mb-4" />
            <div>
                {
                    loading ? (
                        <Loading />
                    ) : error ? (
                        <p className="text-sm font-semibold text-center text-[#ef233c]">
                            {error}
                        </p>
                    ) : (
                        <>
                            <div className="mb-5">
                                <div className="grid grid-cols-2 gap-x-3 mb-3 lg:mb-5">
                                    <div className="px-4 py-2 rounded-md shadow-CustomShadow col-span-1 bg-[#003566]">
                                        <p className="font-[600] text-white text-lg mb-2">
                                            Total Users
                                        </p>
                                        <p className="font-[500] text-white">
                                            Users: {summary.users && summary.users[0] ? summary.users[0].totalUsers : 0}
                                        </p>
                                    </div>
                                    <div className="px-4 py-2 rounded-md shadow-CustomShadow col-span-1 bg-[#57cc99]">
                                        <p className="font-[600] text-white text-lg mb-2">
                                            Total Orders
                                        </p>
                                        <p className="font-[500] text-white">
                                            Orders: {summary.orders && summary.users[0] ? summary.orders[0].totalOrders : 0}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-4 py-3 rounded-md shadow-CustomShadow flex items-center justify-center gap-x-3 bg-[#ee6c4d]">
                                    <p className="font-[600] text-white text-lg">
                                        Total Sales:
                                    </p>
                                    <p className="font-[500] text-white">
                                        $ {summary.orders && summary.users[0] ? summary.orders[0].totalSales.toFixed(2) : 0}
                                    </p>
                                </div>
                            </div>
                            <div className="lg:grid lg:grid-cols-3 lg:gap-x-3">
                                <div className="px-4 py-2 rounded-md shadow-CustomShadow mb-5 lg:col-span-2">
                                    <p className="font-[600] underline">
                                        Daily Sales
                                    </p>
                                    {
                                        summary.dailyOrders.length === 0 ? (
                                            <p>
                                                No Sales
                                            </p>
                                        ) : (
                                            <Chart 
                                                width="100%"
                                                height="400px"
                                                chartType="AreaChart"
                                                loader={ 
                                                    <div className="font-semibold text-sm text-center">
                                                        Loading Chart...
                                                    </div> 
                                                }
                                                data={[
                                                    ['Date', 'Sales'],
                                                    ...summary.dailyOrders.map((order) => [order._id, order.sales])
                                                ]}
                                            />
                                        )
                                    }
                                </div>
                                <div className="rounded-md shadow-CustomShadow lg:h-[440px] lg:col-span-1">
                                    <p className="px-4 py-2  font-[600] underline">
                                        Categories
                                    </p>
                                    {
                                        summary.itemCategories.length === 0 ? (
                                            <p>
                                                No Categories
                                            </p>
                                        ) : (
                                            <Chart 
                                                width="100%"
                                                height="400px"
                                                chartType="PieChart"
                                                loader={ 
                                                    <div className="font-semibold text-sm text-center">
                                                        Loading Chart...
                                                    </div> 
                                                }
                                                data={[
                                                    ['Category', 'Items'],
                                                    ...summary.itemCategories.map((item) => [item._id, item.count])
                                                ]}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </section>
    )
};

export default AdminDashboard;