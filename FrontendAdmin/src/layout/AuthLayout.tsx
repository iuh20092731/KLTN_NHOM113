import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-6xl">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
