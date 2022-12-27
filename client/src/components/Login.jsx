import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';

import { login } from '../actions/auth';

import parkspace from '../assets/images/parkspace.svg';
import logo from '../assets/images/logo.svg';

const required = (value) => {
    if (!value) {
        return (
            <div class='bg-red-100 rounded-lg py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-full' role='alert'>
                <svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='times-circle' class='w-4 h-4 mr-2 fill-current' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='currentColor' d='M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z'></path></svg>
                This field is required!
            </div>
        )
    }
};

const Login = (props) => {
    let navigate = useNavigate();

    const form = useRef();
    const checkBtn = useRef();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { isLoggedIn } = useSelector(state => state.auth);
    const { message } = useSelector(state => state.message);

    const dispatch = useDispatch();

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        setLoading(true);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            dispatch(login(username, password))
            .then(() => {
                navigate('/home');
                window.location.reload();
            })
            .catch(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    };

    if (isLoggedIn) {
        return <Navigate to='/home' />;
    }

    return (
        <div className='min-h-screen bg-gray-100 flex flex-col justify-center bg-parkspace'>
            <div className='absolute top-0 right-0 pr-14 pt-3'><img src={parkspace} alt='ParkSpace' className='h-12 w-50' /></div>

            <div className='mx-auto md:w-full md:max-w-md'>
                <div className='mt-5 bg-white shadow w-full rounded-3xl divide-y px-6 py-4 divide-gray-200 border-2'>
                    <div className='px-5 py-7'>
                        <h1 className='font-semibold pb-14 pt-2 text-3xl'>Login</h1>
                        <Form onSubmit={handleLogin} ref={form}>

                        <label className='font-semibold text-base text-gray-600 pb-1 block' htmlFor='username'>Username</label>
                        <Input 
                            type='text' 
                            className='border rounded-xl px-3 py-3 mt-1 mb-5 text-base w-full' 
                            placeholder='Enter your username'
                            name='username'
                            value={username}
                            onChange={onChangeUsername}
                            validations={[required]}
                        />

                        <label className='font-semibold text-base text-gray-600 pb-1 block' htmlFor='password'>Password</label>
                        <div className='flex'>
                            <div className='flex-auto w-64'>
                                <Input 
                                    type='password' 
                                    className='border rounded-xl px-3 py-3 mt-1 mb-5 text-base w-full' 
                                    placeholder='Enter your password'
                                    name='password'
                                    value={password}
                                    onChange={onChangePassword}
                                    validations={[required]}
                                />
                            </div>
                            <div className='flex-auto w-10 py-3 pl-5'>
                                <a className='w-3' href='home'><img src='https://www.svgrepo.com/show/38604/eye.svg' alt='Similar' className='h-8 w-8' /></a>
                            </div>
                        </div>
                        <button className='mt-5 border transition duration-200 bg-white focus:bg-white-700 focus:shadow-sm focus:ring-4 focus:ring-white focus:ring-opacity-50 w-full py-2.5 rounded-2xl text-lg shadow-sm hover:shadow-md font-semibold text-center inline-block' disabled={loading}>
                            {loading && (
                                <span className='spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0' role='status'></span>
                            )}
                            <span className='inline-block mr-2'>Login</span>
                        </button>

                        {message && (
                            <div className='alert bg-red-100 rounded-lg py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-full alert-dismissible fade show' role='alert'>
                                <svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='times-circle' class='w-4 h-4 mr-2 fill-current' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='currentColor' d='M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z'></path></svg>
                                <strong className='mr-1'>{message} </strong>
                                <button type='button' className='btn-close box-content w-4 h-4 p-1 ml-auto text-yellow-red border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-red-900 hover:opacity-75 hover:no-underline' data-bs-dismiss='alert' aria-label='Close'></button>
                            </div>
                        )}
                        <CheckButton style={{ display: 'none' }} ref={checkBtn} />
                        </Form>
                    </div>
                </div>
            </div>
            <div className='pl-14'>
                <img src={logo} alt='Logo' className='h-24 w-50' />
            </div>
        </div>
    );
};

export default Login;