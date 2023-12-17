import type { NextApiRequest, NextApiResponse } from 'next';
import { registerUser } from '../../services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const newUser = await registerUser(req.body);
      return res.status(201).json({ message: 'userCreated', user: newUser });
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'somethingWentWrong' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
