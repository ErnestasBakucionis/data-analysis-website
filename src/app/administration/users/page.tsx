'use client'
import AnimatedButton from '@/components/AnimatedButton';
import NotAuthorized from '@/components/NotAuthorized';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import useTranslation from "@/utils/useTranslation";

type User = {
    VartotojoID: number;
    Vardas: string;
    Pavarde: string;
    El_pastas: string;
    Role: string;
    Slaptazodis: string;
    Patvirtinti_slaptazodi: string;
};

type RegisterUserParams = {
    name: string;
    surname: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const UsersPage: React.FC = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const [editUserId, setEditUserId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [usersPerPage, setUsersPerPage] = useState<number>(10);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [newUser, setNewUser] = useState({ name: '', surname: '', email: '', role: '', password: '', confirmPassword: '' });
    const [errorMessage, setErrorMessage] = useState("");

    const { data } = useSession();
    const isUserAdmin = data?.user?.role === 'admin';

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);
        setCurrentPage(1);
        fetchUsers(1, term);
    };

    const handleCreate = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();

            setUsers(prevUsers => [...prevUsers, data.user]);

            const initialState = { name: '', surname: '', email: '', role: '', password: '', confirmPassword: '' };
            setNewUser(initialState);
            setErrorMessage("");
        } catch (error) {
            setErrorMessage((error as Error).message);
        }
    };

    const fetchUsers = async (page: number = currentPage, term: string = searchTerm) => {
        const response = await fetch(`/api/users?page=${page}&limit=${usersPerPage}&search=${term}`);
        const data = await response.json();
        setUsers(data.users);
        setTotalUsers(data.total);
    };

    const totalPages = Math.ceil(totalUsers / usersPerPage);

    const changePage = (newPage: number) => {
        setCurrentPage(newPage);
    };


    const handleEdit = (userId: number) => {
        setEditUserId(userId);
    };

    const handleSave = async (userId: number) => {
        const user = users.find((u) => u.VartotojoID === userId);
        if (user) {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                setEditUserId(null);
                fetchUsers();
            } else {
                alert('Failed to update the user.');
            }
        }
    };

    const handleDelete = async (userId: number) => {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchUsers();
        } else {
            alert('Failed to delete the user.');
        }
    };

    const handleRefresh = () => {
        setSearchTerm('');
        fetchUsers(1, '');
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, userId: number) => {
        setUsers(
            users.map((user) =>
                user.VartotojoID === userId ? { ...user, [event.target.name]: event.target.value } : user
            )
        );
    };

    function highlightMatches(text: string, keyword: string) {
        const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
        return <span>{parts.map((part, index) => part.toLowerCase() === keyword.toLowerCase() ? <mark key={index} style={{ backgroundColor: '#10B981', color: 'white', opacity: 0.8 }}>{part}</mark> : part)}</span>;
    }

    return (
        <div>
            {isUserAdmin ? (
                <div className="container mx-auto p-6" >
                    <h1 className="text-3xl font-semibold mb-4">{t("userAdministrationPanel")}</h1>
                    <p className="mb-4 text-red-900">{t("userAdministrationPanelDescription")}</p>
                    <hr className="mb-8" />
                    <h2 className="text-2xl font-semibold mb-4">{t("userSearch")}</h2>
                    <p className="mb-4">{t("userSearchDescription")}</p>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-gray-700 font-bold m-2" htmlFor="search">
                            {t("search")}:
                        </label>
                        <input
                            id="search"
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder={t("searchPlaceholder")}
                            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex-grow"
                        />
                        <AnimatedButton onClick={handleRefresh} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-2">
                            <FontAwesomeIcon icon={faSync} />
                        </AnimatedButton>
                    </div>
                    <div className="overflow-x-auto rounded-lg shadow overflow-hidden">
                        <table className="min-w-full leading-normal bg-white">
                            <thead>
                                <tr className="text-left bg-gray-100">
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                        {t("id")}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                        {t("name")}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                        {t("surname")}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                        {t("email")}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                        {t("role")}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                        {t("actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.VartotojoID} className="hover:bg-gray-50">
                                        <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">{highlightMatches(user.VartotojoID.toString(), searchTerm)}</td>
                                        <td className="border-b">
                                            {editUserId === user.VartotojoID ? (
                                                <input
                                                    type="text"
                                                    name="Vardas"
                                                    value={user.Vardas}
                                                    onChange={(e) => handleInputChange(e, user.VartotojoID)}
                                                    className="form-input rounded-md border-gray-300 bg-green-100 shadow-sm p-1 text-sm"
                                                />
                                            ) : (
                                                highlightMatches(user.Vardas, searchTerm)
                                            )}
                                        </td>
                                        <td className="border-b">
                                            {editUserId === user.VartotojoID ? (
                                                <input
                                                    type="text"
                                                    name="Pavarde"
                                                    value={user.Pavarde}
                                                    onChange={(e) => handleInputChange(e, user.VartotojoID)}
                                                    className="form-input rounded-md border-gray-300 bg-green-100 shadow-sm p-1 text-sm"
                                                />
                                            ) : (
                                                highlightMatches(user.Pavarde, searchTerm)
                                            )}
                                        </td>
                                        <td className="border-b">
                                            {editUserId === user.VartotojoID ? (
                                                <input
                                                    type="email"
                                                    name="El_pastas"
                                                    value={user.El_pastas}
                                                    onChange={(e) => handleInputChange(e, user.VartotojoID)}
                                                    className="form-input rounded-md border-gray-300 bg-green-100 shadow-sm p-1 text-sm"
                                                />
                                            ) : (
                                                highlightMatches(user.El_pastas, searchTerm)
                                            )}
                                        </td>
                                        <td className="border-b">
                                            {editUserId === user.VartotojoID ? (
                                                <select
                                                    name="Role"
                                                    value={user.Role}
                                                    onChange={(e) => handleInputChange(e, user.VartotojoID)}
                                                    className="form-input rounded-md border-gray-300 bg-green-100 shadow-sm p-1 text-sm"
                                                >
                                                    <option value="user">{t("user")}</option>
                                                    <option value="admin">{t("admin")}</option>
                                                    <option value="worker">{t("worker")}</option>
                                                </select>
                                            ) : (
                                                t(user.Role)
                                            )}
                                        </td>
                                        <td className="border-b">
                                            {editUserId === user.VartotojoID ? (
                                                <div className="flex justify-start space-x-2">
                                                    <AnimatedButton
                                                        onClick={() => handleSave(user.VartotojoID)}
                                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded text-xs"
                                                    >
                                                        {t("save")}
                                                    </AnimatedButton>
                                                    <AnimatedButton
                                                        onClick={() => handleDelete(user.VartotojoID)}
                                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
                                                    >
                                                        {t("delete")}
                                                    </AnimatedButton>
                                                    <AnimatedButton
                                                        onClick={() => setEditUserId(null)}
                                                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded text-xs"
                                                    >
                                                        {t("cancel")}
                                                    </AnimatedButton>
                                                </div>
                                            ) : (
                                                <div className="flex justify-start space-x-2">
                                                    <AnimatedButton
                                                        onClick={() => handleEdit(user.VartotojoID)}
                                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded text-xs"
                                                    >
                                                        {t("edit")}
                                                    </AnimatedButton>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination flex justify-center items-center space-x-2 my-4">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <AnimatedButton
                                key={index}
                                className={`px-4 py-2 text-sm border rounded-md ${currentPage === index + 1
                                    ? 'bg-green-500 text-white border-green-500'
                                    : 'bg-white text-green-500 border-gray-300 hover:bg-blue-100'
                                    }`}
                                onClick={() => changePage(index + 1)}
                                disabled={currentPage === index + 1}
                            >
                                {index + 1}
                            </AnimatedButton>
                        ))}
                    </div>
                    <hr className="mb-8" />
                    <h2 className="text-2xl font-semibold mb-8">{t("createNewUser")}</h2>
                    <form onSubmit={handleCreate} className="mt-8 space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <input type="hidden" name="remember" value="true" />
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                {t("name")}
                            </label>
                            <input id="name" name="name" type="text" required autoComplete="off"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder={t("name")} value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
                                {t("surname")}
                            </label>
                            <input id="surname" name="surname" type="text" required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder={t("surname")} value={newUser.surname} onChange={e => setNewUser({ ...newUser, surname: e.target.value })} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email-address">
                                {t("email")}
                            </label>
                            <input id="email-address" name="email" type="email" autoComplete="email" required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder={t("email")} value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                {t("password")}
                            </label>
                            <input id="password" name="password" type="password" required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder={t("password")} value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                {t("confirmPassword")}
                            </label>
                            <input id="confirmPassword" name="confirmPassword" type="password" required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder={t("confirmPassword")} value={newUser.confirmPassword} onChange={e => setNewUser({ ...newUser, confirmPassword: e.target.value })} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                                {t("role")}
                            </label>
                            <select id="role" name="role" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                <option value="">{t("selectRole")}</option>
                                <option value="user">{t("user")}</option>
                                <option value="admin">{t("admin")}</option>
                                <option value="worker">{t("worker")}</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                {t("create")}
                            </button>
                            {errorMessage && (
                                <div className="text-red-500 text-sm mt-2">
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            ) : (
                <NotAuthorized />
            )}
        </div>
    );
};

export default UsersPage;
