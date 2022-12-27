import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

import "./App.css";

import Login from './components/Login';
import Home from './components/Home';

// import { logout } from './actions/auth';
import { clearMessage } from './actions/message';

const App = () => {

    const { user: currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    let location = useLocation();

    useEffect(() => {
        if (['/login'].includes(location.pathname)){
            dispatch(clearMessage()); //clear message when changing location
        }
    }, [dispatch, location]);

    // const logOut = useCallback(() => {
    //     dispatch(logout());
    // }, [dispatch]);

    return (
        <div>
            {/* <div>
                <a href='/login' onClick={logOut}>Logout</a>
            </div> */}
            <div>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;