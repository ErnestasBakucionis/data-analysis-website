import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllUsers } from '../../services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const searchTerm = req.query.search as string || '';

            const { users, total } = await getAllUsers(page, limit, searchTerm);
            return res.status(200).json({ users, total });
        } catch (error) {
            return res.status(500).json({ message: 'An error occurred while fetching users.' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}