'use-client';
import React, { useEffect, useState } from 'react'

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
    const [orders, setOrders] = useState<Order[]>([]);

    return (
        <div>OrdersTable</div>
    )
}

export default OrdersTable