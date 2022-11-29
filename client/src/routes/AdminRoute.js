import React, { useContext} from 'react';
import { Navigate } from 'react-router-dom';

import { Context } from '../context/_context';

const AdminRoute = ({ children }) => {

    const { state } = useContext(Context);
    const { userInfo } = state;

    return (
        userInfo && userInfo.isAdmin ? children : <Navigate to='/login' />
    )
};

export default AdminRoute;