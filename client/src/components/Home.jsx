// import React, { useState, useEffect } from 'react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// import UserService from '../services/userService';
import Sidebar from './Sidebar';
import appointment from '../assets/images/appointment.png';
import spaces from '../assets/images/spaces.png';
import emptyNfill from '../assets/images/empty-and-fill-cells.png';
import search from '../assets/images/search.png';
import location from '../assets/images/location.png';
import way from '../assets/images/way.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'


const Home = () => {
    let url = ''
    // const [content, setContent] = useState('');

    // useEffect(() => {
    //     UserService.getAdminBoard().then(
    //         (response) => {
    //             setContent(response.data);
    //         },
    //         (error) => {
    //             const _content =
    //                 (error.response && error.response.data && error.response.data.message) 
    //                 || error.message || error.toString();
                
    //             setContent(_content);
    //         }
    //     );
    // }, []);

    const { user: currentUser } = useSelector((state) => state.auth);

    if (!currentUser) {
        return <Navigate to='/login' />;
    }

    return (
        <body className='flex bg-putih font-family-karla'>
            <Sidebar></Sidebar>
            <div className='w-full flex flex-col h-screen overflow-y-hidden'>
                {/*Mobile Header & Nav*/}
                <header x-data='{ isOpen: false }' className='w-full bg-sidebar py-5 px-6 sm:hidden'>
                    <div className='flex items-center justify-between'>
                    <a href={url} className='text-white text-3xl font-semibold uppercase hover:text-gray-300'>Admin</a>
                        {/* <button @click="isOpen = !isOpen" className='text-white text-3xl focus:outline-none'> */}
                        <button className='text-white text-3xl focus:outline-none'>
                            <i x-show='!isOpen'>
                                <FontAwesomeIcon icon={faBars}/>
                            </i>
                            <i x-show='isOpen'>
                                <FontAwesomeIcon icon={faTimes}/>
                            </i>
                        </button>
                    </div>

                    <nav className='flex flex-col pt-4'>
                        <a href='index.html' className='flex items-center active-nav-link text-white py-2 pl-4 nav-item'>
                            <i className='fas fa-tachometer-alt mr-3'></i>
                            Home
                        </a>
                        <a href='blank.html' className='flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item'>
                            <i className='fas fa-sticky-note mr-3'></i>
                            Payment
                        </a>
                    </nav>
                </header>

                {/* Desktop */}
                <div className='w-full overflow-x-hidden border-t flex flex-col'>
                    <main className='w-full flex-grow p-6'>
                    <h1 className='text-3xl text-black pb-2'>Home | {currentUser.username}</h1>
                        <div className='flex flex-wrap mt-4 border-2 bg-hitam py-5 rounded-2xl'>
                            <div className='shadow-2xl bg-biru rounded-lg mx-3 h-20 w-40'>
                                <div className='flex justify-center'>
                                    <img src={appointment} className='mt-2 mr-2 w-8 h-8 text-blue' alt='appointment' />
                                    <h1 className='mx- mt-1 text-4xl'>15</h1>
                                </div>
                                <p className='mx-4 mt-1 text-base'>Jumlah Booking</p>
                            </div>
                            <div className='shadow-2xl bg-biru rounded-lg mx-3 h-20 w-40'>
                                <div className='flex justify-center'>
                                    <img src={spaces} className='mt-2 mr-2 w-8 h-8 text-blue' alt='spaces' />
                                    <h1 className='mx- mt-1 text-4xl'>25</h1>
                                </div>
                                <p className='mx-4 mt-1 text-base'>Tempat Kosong</p>
                            </div>
                            <div className='shadow-2xl bg-biru rounded-lg mx-3 h-20 w-40'>
                                <div className='flex justify-center'>
                                    <img src={emptyNfill} className='mt-2 mr-2 w-8 h-8 text-blue' alt='Empty and Fill Cells' />
                                    <h1 className='mx- mt-1 text-4xl'>15</h1>
                                </div>
                                <p className='mx-10 mt-1 text-base'>Tempat Isi</p>
                            </div>
                        </div>

                        <div className='flex flex-wrap mt-6'>
                            <div className='w-full lg:w-8/12 pr-0 lg:pr-2'>
                                <div className='flax flax-nowrap ml-5 mb-2'>
                                    <FontAwesomeIcon icon={faPlus} className='mr-3' />
                                    <a href={url}>
                                        <button className='my-0 mx-2 border-2 rounded-xl bg-hitam putih font-bold account-link h-10 w-16'>A</button>
                                    </a>
                                    <a href={url}>
                                        <button className='my-0 mx-2 border-2 rounded-xl bg-abu putih font-bold account-link h-10 w-16'>B</button>
                                    </a>
                                    <a href={url}>
                                        <button className='my-0 mx-2 border-2 rounded-xl bg-abu putih font-bold account-link h-10 w-16'>C</button>
                                    </a>
                                    <a href={url}>
                                        <button className='my-0 mx-2 border-2 rounded-xl bg-abu putih font-bold account-link h-10 w-16'>D</button>
                                    </a>
                                </div>
                                <div className='bg-hitam pt-6 pr-0 pl-3 bg-white rounded-2xl'>
                                    <div className="grid grid-rows-4 grid-flow-col gap-1 border-gray-50">
                                        <div className="">
                                            <div className="grid grid-cols-2">
                                                <div className=""></div>
                                                <button className="h-putih bg-biru rounded-sm h-16 w-10">A1</button>
                                            </div>
                                        </div>
                                        <div className="row-span-2 ml-3">
                                            <div className="grid grid-rows-4">
                                                <button className="my-2 h-putih rounded-sm bg-abu h-10 w-20">A37</button>
                                                <button className="my-2 h-putih rounded-sm bg-abu h-10 w-20">A38</button>
                                                <button className="my-2 h-putih rounded-sm bg-abu h-10 w-20">A39</button>
                                                <button className="my-2 h-putih rounded-sm bg-biru h-10 w-20">A40</button>
                                            </div>
                                        </div>

                                        <div className=""></div>
                                        <div className="static col-span-4">
                                            <div className="mx-4 flex flex-row justify-around">
                                                <button className="h-putih rounded-sm bg-kuning h-16 w-10">A2</button>
                                                <button className="h-putih rounded-sm bg-kuning h-16 w-10">A3</button>
                                                <button className="h-putih rounded-sm bg-kuning h-16 w-10">A4</button>
                                                <button className="h-putih rounded-sm bg-kuning h-16 w-10">A5</button>
                                                <button className="h-putih rounded-sm bg-kuning h-16 w-10">A6</button>
                                                <button className="h-putih rounded-sm bg-biru h-16 w-10">A7</button>
                                                <button className="h-putih rounded-sm bg-biru h-16 w-10">A8</button>
                                                <button className="h-putih rounded-sm bg-biru h-16 w-10">A9</button>
                                                <button className="h-putih rounded-sm bg-kuning h-16 w-10">A10</button>
                                            </div>
                                        </div>
                                        <div className="static col-span-4">
                                            <div className="mx-4 flex flex-row justify-around">
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A12</button>
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A13</button>
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A14</button>
                                                <button className="h-putih rounded-sm bg-kuning h-16 w-10">A15</button>
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A16</button>
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A17</button>
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A18</button>
                                                <button className="h-putih rounded-sm bg-biru h-16 w-10">A19</button>
                                                <button className="h-putih rounded-sm bg-biru h-16 w-10">A20</button>
                                            </div>
                                        </div>
                                        <div className="static col-span-4">
                                            <div className="mx-4 flex flex-row justify-around">
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A21</button>
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A22</button>
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A23</button>
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A24</button>
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A25</button>
                                                <button className="h-putih rounded-sm bg-biru h-16 w-10">A26</button>
                                                <button className="h-putih rounded-sm bg-biru h-16 w-10">A27</button>
                                                <button className="h-putih rounded-sm bg-kuning h-16 w-10">A28</button>
                                                <button className="h-putih rounded-sm bg-biru h-16 w-10">A29</button>
                                            </div>
                                        </div>
                                        <div className="static col-span-4">
                                            <div className="mx-10 flex flex-row justify-around">
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A30</button>
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A31</button>
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A32</button>
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A33</button>
                                                <button className="h-putih rounded-sm bg-abu h-16 w-10">A34</button>
                                                <button className="h-putih rounded-sm bg-biru h-16 w-10">A35</button>
                                                <button className="h-putih rounded-sm bg-biru h-16 w-10">A36</button>
                                            </div>
                                        </div>

                                        <div className="">
                                            <div className="static grid grid-cols-2">
                                                <button className="h-putih rounded-sm bg-biru h-16 w-10">A11</button>
                                                <div className=""></div>
                                            </div>
                                        </div>
                                        <div className="row-span-2 ml-4">
                                            <div className="grid grid-rows-4">
                                                <button className="my-2 h-putih rounded-sm bg-kuning h-10 w-20">A41</button>
                                                <button className="my-2 h-putih rounded-sm bg-kuning h-10 w-20">A42</button>
                                                <button className="my-2 h-putih rounded-sm bg-kuning h-10 w-20">A43</button>
                                                <button className="my-2 h-putih rounded-sm bg-kuning h-10 w-20">A44</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full lg:w-4/12 pl-0 lg:pl-2 mt-12 lg:mt-0'>
                                <div className='flex flex-row'>
                                    <div className=''>
                                        <p className='text-lg items-center mr-2'>
                                            <FontAwesomeIcon icon={faCheck} className='mr-1' /> Isi Data
                                        </p>
                                    </div>
                                    <div className='bg-white'>
                                        <input type='text'></input>
                                    </div>
                                    <button className='' type='submit'>
                                        <img className='h-3 w-3 mx-3' src={search} alt='Search'></img>
                                    </button>
                                </div>
                                <div className='px-6 py-7 bg-hitam mt-6 rounded-2xl'>
                                    <div className='bg-putih flex flex-col rounded-2xl shadow-md p-4 border-4'>
                                        <h1 className='text-5xl font-bold'>A-11</h1>
                                        <h2 className='text-sm'>Lantai pertama, sektor A</h2>
                                        <div className='flex flex-row'>
                                            <div className='pl-10 bg-hitam h-2 rounded-lg w-36 mt-5 mb-3'></div>
                                            <div className='ml-3 bg-biru h-2 rounded-lg w-5 mt-5 mb-3'></div>
                                            <div className='ml-1 bg-biru h-2 rounded-lg w-5 mt-5 mb-3'></div>
                                            <div className='ml-1 bg-biru h-2 rounded-lg w-5 mt-5 mb-3'></div>
                                        </div>
                                        <div className='flex flex-col'>
                                            <div className='flex flex-row justify-around'>
                                                <div>
                                                    <p className='text-2xl'>...</p>
                                                    <p className='text-sm'>Waktu Booking</p>
                                                </div>
                                                <div>
                                                    <p className='ml-20 text-2xl'>...</p>
                                                    <p className='ml-14 text-sm '>Perkiraan sampai</p>
                                                </div>
                                            </div>
                                            <div className='w-full bg-biru mt-5 flex flex-row justify-around rounded-lg'>
                                                <img src={location} alt='Location' className='mt-2 mr-2 w-8 h-8 text-blue' />
                                                <h1 className='mx- mt-1 text-4xl kuning'>0</h1>
                                                <h1 className='mx- py-2 text-2xl'>Min</h1>
                                            </div>
                                            <div className='w-full bg-biru mt-5 flex flex-ro justify-around rounded-lg'>
                                                <img src={way} alt='Way' className='mt-2 mr-2 w-8 h-8 text-blue' />
                                                <h1 className='mx- mt-1 text-4xl kuning'>0</h1>
                                                <h1 className='mx- py-2 text-2xl'>Km</h1>
                                            </div>
                                            <button className='px-4 py-2 bg-hitam text-white rounded-lg mt-10 mx-10' type='submit'>Check-in</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    <footer className='w-full bg-white text-right p-4'>Built by 
                        <a target='_blank' href={url} className='underline' rel='noreferrer'>XLIPSE - ParkSpace</a>.
                    </footer>
                </div>
            </div>
        </body>
    )
}

export default Home;