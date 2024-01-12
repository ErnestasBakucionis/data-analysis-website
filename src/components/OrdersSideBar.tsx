'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useSession } from 'next-auth/react';
import useTranslation from "@/utils/useTranslation";
import useUserRole from '@/hooks/useUserRole';
import NotAuthorized from './NotAuthorized';

const Sidebar: React.FC = () => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const { isLoggedIn } = useUserRole();

    if (!isLoggedIn) {
        return <NotAuthorized />;
    }

    const isActive = (path: string): boolean => {
        return pathname === path;
    };

    return (
        <div className="min-h-screen w-64 bg-gray-800 text-white p-5">
            <div className="text-2xl font-bold text-center mb-6">Orders</div>
            <ul className="space-y-4">
                <li>
                    <Link href="/orders/myorders">
                        <div
                            className={`bg-gray-700 block py-1 px-4 rounded-lg cursor-pointer transition duration-200 hover:bg-green-500 ${isActive("/orders/myorders") ? "bg-green-500 text-gray-100" : "text-gray-300"}`}
                        >
                            {t('myOrders')}
                        </div>
                    </Link>
                </li>
                <li>
                    <Link href="/orders/automatedAnalysis">
                        <div
                            className={`bg-gray-700 block py-1 px-4 rounded-lg cursor-pointer transition duration-200 hover:bg-green-500 ${isActive("/orders/automatedAnalysis") ? "bg-green-500 text-gray-100" : "text-gray-300"}`}
                        >
                            {t('aboutAutomatedAnalysis')}
                        </div>
                    </Link>
                </li>
                <li>
                    <Link href="/orders/regression">
                        <div
                            className={`bg-gray-700 block py-1 px-4 rounded-lg cursor-pointer transition duration-200 hover:bg-green-500 ${isActive("/orders/regression") ? "bg-green-500 text-gray-100" : "text-gray-300"}`}
                        >
                            {t('regression')}
                        </div>
                    </Link>
                </li>

                <li>

                    <div
                        className={`bg-gray-700 block py-1 px-4 rounded-lg cursor-not-allowed transition duration-200 ${isActive("/orders/segmentation") ? "bg-green-500 text-gray-100" : "text-gray-300"}`}
                    >
                        {t('segmentation')} ({t('underDevelopment')})
                    </div>
                    {/* <Link href="/orders/segmentation">
                        <div
                            className={`bg-gray-700 block py-1 px-4 rounded-lg cursor-pointer transition duration-200 hover:bg-green-500 ${isActive("/orders/segmentation") ? "bg-green-500 text-gray-100" : "text-gray-300"}`}
                        >
                            Segmentation Analysis
                        </div>
                    </Link> */}
                </li>
                <li>

                    <div
                        className={`bg-gray-700 block py-1 px-4 rounded-lg cursor-not-allowed transition duration-200 ${isActive("/orders/timeseries") ? "bg-green-500 text-gray-100" : "text-gray-300"}`}
                    >
                        {t('cohort')} ({t('underDevelopment')})
                    </div>
                    {/* <Link href="/orders/cohort">
                        <div
                            className={`bg-gray-700 block py-1 px-4 rounded-lg cursor-pointer transition duration-200 hover:bg-green-500 ${isActive("/orders/cohort") ? "bg-green-500 text-gray-100" : "text-gray-300"}`}
                        >
                            Cohort Analysis
                        </div>
                    </Link> */}
                </li>
                <li>
                    <div
                        className={`bg-gray-700 block py-1 px-4 rounded-lg cursor-not-allowed transition duration-200 ${isActive("/orders/timeseries") ? "bg-green-500 text-gray-100" : "text-gray-300"}`}
                    >
                        {t('timeSeries')} ({t('underDevelopment')})
                    </div>
                    {/* <Link href="/orders/timeseries">
                        <div
                            className={`bg-gray-700 block py-1 px-4 rounded-lg cursor-pointer transition duration-200 hover:bg-green-500 ${isActive("/orders/timeseries") ? "bg-green-500 text-gray-100" : "text-gray-300"}`}
                        >
                            Time series Analysis
                        </div>
                    </Link> */}
                </li>
            </ul>
        </div>

    );
};

export default Sidebar;
