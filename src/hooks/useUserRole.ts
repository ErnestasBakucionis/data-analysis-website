import { useSession } from 'next-auth/react';

const useUserRole = () => {
    const { data } = useSession();
    const isUserAdmin = data?.user?.role === 'admin';
    const isUserDefault = data?.user?.role === 'user';
    const isUserWorker = data?.user?.role === 'worker';
    const isLoggedIn = isUserAdmin || isUserDefault || isUserWorker;

    return {
        isUserAdmin,
        isUserDefault,
        isUserWorker,
        isLoggedIn,
    };
};

export default useUserRole;