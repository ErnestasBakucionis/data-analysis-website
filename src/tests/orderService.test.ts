import { createOrder, getOrdersByUserId, getOrderById, updateOrder } from '../services/orderService';
import prisma from '../db/prismaClient';

jest.mock('../db/prismaClient', () => ({
    uzsakymas: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
    },
}));

interface OrderParams {
    csvFilePath: string;
    orderDate: Date;
    processType: string;
    dataType: string;
    analysisTool: string;
    userId: number;
    jsonData: any;
}

describe('createOrder', () => {
    // Should create a new order
    const mockOrderParams: OrderParams = {
        csvFilePath: 'test',
        orderDate: new Date(),
        processType: 'test',
        dataType: 'test',
        analysisTool: 'test',
        userId: 1,
        jsonData: {},
    };

    it('should create a new order', async () => {
        const mockCreate = prisma.uzsakymas.create as jest.Mock;
        mockCreate.mockResolvedValue({ id: 1 });

        await createOrder(mockOrderParams);

        expect(mockCreate).toHaveBeenCalledWith({
            data: {
                VartotojoID: mockOrderParams.userId,
                Uzsakymo_busena: 'Pending',
                Uzsakymo_data: mockOrderParams.orderDate,
                Proceso_tipas: mockOrderParams.processType,
                Duomenu_tipas: mockOrderParams.dataType,
                Analizes_irankis: mockOrderParams.analysisTool,
                CSV_Duomenu_kelias: mockOrderParams.csvFilePath,
                JSON_duomenys: mockOrderParams.jsonData,
            },
        });
    });

    // Should throw an error if order creation fails
    it('should throw an error if order creation fails', async () => {
        const mockCreate = prisma.uzsakymas.create as jest.Mock;
        mockCreate.mockRejectedValue(new Error('test'));

        await expect(createOrder(mockOrderParams)).rejects.toThrow('test');
    });
});

describe('getOrdersByUserId', () => {
    /// Should return orders by user ID
    it('should return orders by user ID', async () => {
        const mockUserId = 1;
        const mockOrders = [{ id: 1 }, { id: 2 }];
        const mockTotal = 2;

        (prisma.uzsakymas.findMany as jest.Mock).mockResolvedValue(mockOrders);
        (prisma.uzsakymas.count as jest.Mock).mockResolvedValue(mockTotal);

        const result = await getOrdersByUserId(mockUserId);

        expect(prisma.uzsakymas.findMany).toHaveBeenCalledWith(expect.anything());
        expect(prisma.uzsakymas.count).toHaveBeenCalledWith(expect.anything());

        expect(result.orders).toEqual(mockOrders);
        expect(result.total).toEqual(mockTotal);
    });

    // Should return orders by user ID and search term
    it('should return orders by user ID and search term', async () => {
        const mockUserId = 1;
        const mockOrders = [{ id: 1 }, { id: 2 }];
        const mockTotal = 2;
        const mockSearchTerm = 'test';

        (prisma.uzsakymas.findMany as jest.Mock).mockResolvedValue(mockOrders);
        (prisma.uzsakymas.count as jest.Mock).mockResolvedValue(mockTotal);

        const result = await getOrdersByUserId(mockUserId, 1, 10, mockSearchTerm);

        expect(prisma.uzsakymas.findMany).toHaveBeenCalledWith(expect.anything());
        expect(prisma.uzsakymas.count).toHaveBeenCalledWith(expect.anything());

        expect(result.orders).toEqual(mockOrders);
        expect(result.total).toEqual(mockTotal);
    });

    // Should throw an error if orders retrieval fails
    it('should throw an error if orders retrieval fails', async () => {
        const mockUserId = 1;

        (prisma.uzsakymas.findMany as jest.Mock).mockRejectedValue(new Error('test'));

        await expect(getOrdersByUserId(mockUserId)).rejects.toThrow('test');
    });
});

describe('getOrderById', () => {
    // Should return order by ID
    it('should return order by ID', async () => {
        const mockUserId = 1;
        const mockOrderId = 1;
        const mockOrder = { id: 1 };

        (prisma.uzsakymas.findUnique as jest.Mock).mockResolvedValue(mockOrder);

        const result = await getOrderById(mockOrderId, mockUserId);

        expect(prisma.uzsakymas.findUnique).toHaveBeenCalledWith(expect.anything());

        expect(result).toEqual(mockOrder);
    });
});

describe('updateOrder', () => {
    // Should update order status
    it('should update order status', async () => {
        const mockUserId = 1;
        const mockOrderId = 1;
        const mockNewStatus = 'Pending';

        (prisma.uzsakymas.update as jest.Mock).mockResolvedValue({ id: 1 });

        await updateOrder({ orderId: mockOrderId, userId: mockUserId, newStatus: mockNewStatus });

        expect(prisma.uzsakymas.update).toHaveBeenCalledWith(expect.anything());
    });

    // Should update order analysis data
    it('should update order analysis data', async () => {
        const mockUserId = 1;
        const mockOrderId = 1;
        const mockAnalysisData = {};

        (prisma.uzsakymas.update as jest.Mock).mockResolvedValue({ id: 1 });

        await updateOrder({ orderId: mockOrderId, userId: mockUserId, analysisJsonData: mockAnalysisData });

        expect(prisma.uzsakymas.update).toHaveBeenCalledWith(expect.anything());
    });

    // Should throw an error if order update fails
    it('should throw an error if order update fails', async () => {
        const mockUserId = 1;
        const mockOrderId = 1;
        const mockNewStatus = 'Pending';

        (prisma.uzsakymas.update as jest.Mock).mockRejectedValue(new Error('test'));

        await expect(updateOrder({ orderId: mockOrderId, userId: mockUserId, newStatus: mockNewStatus })).rejects.toThrow(
            'test'
        );
    });

    // Check newStatus validation
    it('should throw an error if newStatus is invalid', async () => {
        const mockUserId = 1;
        const mockOrderId = 1;
        const mockNewStatus = 'invalid';

        await expect(updateOrder({ orderId: mockOrderId, userId: mockUserId, newStatus: mockNewStatus })).rejects.toThrow(
            'invalidStatus'
        );
    });

    // Check if order exists
    it('should throw an error if order does not exist', async () => {
        const mockUserId = 1;
        const mockOrderId = 1;
        const mockNewStatus = 'Pending';

        (prisma.uzsakymas.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(updateOrder({ orderId: mockOrderId, userId: mockUserId, newStatus: mockNewStatus })).rejects.toThrow(
            'orderNotFound'
        );
    });

});