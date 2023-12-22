import React, { ReactNode } from 'react';
import Sidebar from '@/components/AdministrationSideBar';
import OrdersSidebar from '@/components/OrdersSideBar';

type LayoutProps = {
    children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {

    return (
        <div className="flex">
            <OrdersSidebar />
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};

export default Layout;
