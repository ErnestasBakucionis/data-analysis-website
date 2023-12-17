import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteUser, getAllUsers, updateUser } from '../../../services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const userId = parseInt(req.query.id as string);

    switch (req.method) {
        case 'GET':
            const users = await getAllUsers();
            res.status(200).json(users);
            break;
        case 'PUT':
            const updatedUser = await updateUser(userId, req.body);
            res.status(200).json(updatedUser);
            break;
        case 'DELETE':
            await deleteUser(userId);
            res.status(200).end();
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
