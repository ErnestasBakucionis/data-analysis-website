'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useSession } from 'next-auth/react';
import useTranslation from "@/utils/useTranslation";

const Sidebar: React.FC = () => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const { data } = useSession();
    const isUserAdmin = data?.user?.role === 'admin';

    const isActive = (path: string): boolean => {
        return pathname === path;
    };

    return (
        <div className="min-h-screen w-64 bg-gray-800 text-white p-5">
            <div className="text-2xl font-bold text-center mb-6">{t("administrationPanel")}</div>
            <ul className="space-y-4">
                <li>
                    <Link href="/administration/users">
                        <div
                            className={`bg-gray-700 block py-1 px-4 rounded-lg cursor-pointer transition duration-200 hover:bg-green-500 ${isActive("/administration/users") ? "bg-green-500 text-gray-100" : "text-gray-300"}`}
                        >
                            {t("users")}
                        </div>
                    </Link>
                </li>
                <li>
                    <div
                        className={`bg-gray-700 block py-1 px-4 rounded-lg cursor-not-allowed transition duration-200 ${isActive("/administration/orders") ? "bg-green-500 text-gray-100" : "text-gray-300"}`}
                    >
                        {t("orders")} (Under development)
                    </div>
                    {/* <Link href="/administration/orders">
                        <div
                            className={`bg-gray-700 block py-1 px-4 rounded-lg cursor-pointer transition duration-200 hover:bg-green-500 ${isActive("/administration/orders") ? "bg-green-500 text-gray-100" : "text-gray-300"}`}
                        >
                            {t("orders")}
                        </div>
                    </Link> */}
                </li>
            </ul>
        </div>

    );
};

export default Sidebar;
