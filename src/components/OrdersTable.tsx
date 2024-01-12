'use-client';
import React, { useEffect, useState } from 'react'
import SearchBar from './SearchBar';
import { useSession } from 'next-auth/react';
import Pagination from './Pagination';
import AnimatedButton from './AnimatedButton';
import Link from 'next/link';
import useTranslation from '@/utils/useTranslation';

type Order = {
    UzsakymoID: number;
    VartotojoID: number;
    Uzsakymo_data: Date;
    Uzsakymo_busena: string;
    Proceso_tipas: string;
    Duomenu_tipas?: string;
    Analizes_irankis?: string;
    CSV_Duomenu_kelias?: string;
    Analizes_rezultatai?: any;
};

const OrdersTable: React.FC = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [ordersPerPage, setOrdersPerPage] = useState<number>(10);
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const { data } = useSession();
    const userId = data?.user?.id;
    const totalPages = Math.ceil(totalOrders / ordersPerPage);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);
        setCurrentPage(1);
        fetchOrders(1, term);
    };

    const changePage = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleRefresh = () => {
        setSearchTerm('');
        fetchOrders(1, '');
    };

    const fetchOrders = async (page: number = currentPage, term: string = searchTerm) => {
        const response = await fetch(`/api/orders?userId=${userId}&page=${page}&limit=${ordersPerPage}&search=${term}`);
        const data = await response.json();
        setOrders(data.orders);
        setTotalOrders(data.total);
    };

    const handleViewResult = async (orderId: number) => {
        // const response = await fetch(`/api/orders/${orderId}`);
        // const data = await response.json();
        // alert(JSON.stringify(data));
    }

    function formatDateToLithuanian(dateString: string): string {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return new Intl.DateTimeFormat('lt-LT', options).format(date);
    }

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    function highlightMatches(text: string, keyword: string) {
        const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
        return <span>{parts.map((part, index) => part.toLowerCase() === keyword.toLowerCase() ? <mark key={index} style={{ backgroundColor: '#10B981', color: 'white', opacity: 0.8 }}>{part}</mark> : part)}</span>;
    }

    return (
        <>
            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                onRefresh={handleRefresh} />
            <div className="overflow-x-auto rounded-lg shadow overflow-hidden">
                <table className="min-w-full leading-normal bg-white">
                    <thead>
                        <tr className="text-left bg-gray-100">
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                {t('id')}
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                {t('date')}
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                {t('processType')}
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                {t('dataTemplate')}
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                {t('analysisTool')}
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                {t('status')}
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                {t('actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.UzsakymoID} className="hover:bg-gray-50">
                                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                    {highlightMatches(order.UzsakymoID.toString(), searchTerm)}
                                </td>
                                <td className="border-b">
                                    {highlightMatches(formatDateToLithuanian(order.Uzsakymo_data.toString()), searchTerm)}
                                </td>
                                <td className="border-b">
                                    {highlightMatches(t(order.Proceso_tipas), searchTerm)}
                                </td>
                                <td className="border-b">
                                    {highlightMatches(t(order.Duomenu_tipas ?? ''), searchTerm)}
                                </td>
                                <td className="border-b">
                                    {highlightMatches(t(order.Analizes_irankis ?? ''), searchTerm)}
                                </td>
                                <td className={`border-b ${order.Uzsakymo_busena === 'Pending' ? 'text-blue-500' : order.Uzsakymo_busena === 'Done' ? 'text-green-500' : ''}`}>
                                    {highlightMatches(t(order.Uzsakymo_busena), searchTerm)}
                                </td>
                                <td>
                                    <Link
                                        href={{
                                            pathname: '/orders/order',
                                            query: { id: order.UzsakymoID },
                                        }}
                                        className={`bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded text-xs 
                                                    ${order.Uzsakymo_busena === 'Pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    // disabled={order.Uzsakymo_busena === 'pending'}
                                    >
                                        {t('viewResult')}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={changePage}
            />
        </>
    )
}

export default OrdersTable