import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { logout } from '../actions/auth';
import logo from '../assets/images/logo.svg';
import switchPNG from '../assets/images/switch.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTachometerAlt, faStickyNote } from '@fortawesome/free-solid-svg-icons'

const Sidebar = () => {
    let url = ''

    const dispatch = useDispatch();

    const logOut = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    return (
        <aside className='relative bg-sidebar h-screen w-48 hidden sm:block shadow-xl'>
            <div className='p-6'>
                <a href={url} className='text-white text-3xl font-semibold uppercase hover:text-gray-300'>
                    <div className='pl-6'>
                        <img src={logo} className='h-16 w-50' alt='Logo' />
                    </div>
                </a>
            </div>
            <nav className='text-white text-base font-semibold pt-3'>
                <a href={url} className='flex items-center active-nav-link text-white py-3 pl-6 nav-item'>
                    <FontAwesomeIcon icon={faTachometerAlt} className='mr-3' />
                    Home
                </a>
                <a href={url} className='flex items-center text-white opacity-75 hover:opacity-100 py-3 pl-6 nav-item'>
                    <FontAwesomeIcon icon={faStickyNote} className='mr-3' />
                    Payment
                </a>
                <a href='/login' onClick={logOut} className='flex items-center text-white opacity-75 hover:opacity-100 py-3 pl-5 nav-item'>
                    <img src={switchPNG} alt='Switch' className='mr-3 h-5 w-5' />
                    Logout
                </a>
            </nav>
        </aside>
    );
};


export default Sidebar;