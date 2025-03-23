import React from 'react';
import { Outlet } from 'react-router-dom';

const Root = () => {
    return (
        <div>
            <h2 className='text-3xl bg-red-600'>Root</h2>
            <Outlet/>
        </div>
    );
};

export default Root;