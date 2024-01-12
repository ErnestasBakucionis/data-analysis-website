import { registerUser, deleteUser, getAllUsers, updateUser } from '../services/userService';
import prisma from '../db/prismaClient';
import bcrypt from 'bcryptjs';

jest.mock('../db/prismaClient', () => ({
    vartotojas: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
    },
}));
jest.mock('bcryptjs');

type RegisterUserParams = {
    name: string;
    surname: string;
    email: string;
    password: string;
    confirmPassword: string;
};

describe('registerUser', () => {
    // Throw error if email is missing
    const mockRegisterUserParams: RegisterUserParams = {
        name: 'test',
        surname: 'test',
        email: '',
        password: 'test',
        confirmPassword: 'test',
    };

    it('should throw an error if email is missing', async () => {
        await expect(registerUser(mockRegisterUserParams)).rejects.toThrow("emailIsRequired");
    });

    // Throw error if passwords do not match
    const mockRegisterUserParams2: RegisterUserParams = {
        name: 'test',
        surname: 'test',
        email: 'test@gmail.com',
        password: 'test',
        confirmPassword: 'test2',
    };

    it('should throw an error if passwords do not match', async () => {
        await expect(registerUser(mockRegisterUserParams2)).rejects.toThrow("passwordsMustMatch");
    });

    // Throw error if email already exists
    const mockRegisterUserParams3: RegisterUserParams = {
        name: 'test',
        surname: 'test',
        email: 'testexists@gmail.com',
        password: 'test',
        confirmPassword: 'test',
    };

    it('should throw an error if email already exists', async () => {
        (prisma.vartotojas.findUnique as jest.Mock).mockResolvedValue({
            El_pastas: mockRegisterUserParams3.email,
        });

        await expect(registerUser(mockRegisterUserParams3)).rejects.toThrow("emailAlreadyExists");

        expect(prisma.vartotojas.findUnique).toHaveBeenCalledWith({
            where: {
                El_pastas: mockRegisterUserParams3.email,
            },
        });
    });

    // Check if password is hashed
    const mockRegisterUserParams4: RegisterUserParams = {
        name: 'test',
        surname: 'test',
        email: 'testas@gmail.com',
        password: 'test',
        confirmPassword: 'test',
    };

    it('should hash the password', async () => {
        (prisma.vartotojas.findUnique as jest.Mock).mockResolvedValue(null);

        await registerUser(mockRegisterUserParams4);

        expect(bcrypt.hash).toHaveBeenCalledWith(mockRegisterUserParams4.password, 10);
    });

    // Check if user is created
    const mockRegisterUserParams5: RegisterUserParams = {
        name: 'test',
        surname: 'test',
        email: 'goodtest@gmail.com',
        password: 'test',
        confirmPassword: 'test',
    };

    it('should create a user', async () => {
        (prisma.vartotojas.findUnique as jest.Mock).mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
        (prisma.vartotojas.create as jest.Mock).mockResolvedValue({
            Vardas: mockRegisterUserParams5.name,
            Pavarde: mockRegisterUserParams5.surname,
            El_pastas: mockRegisterUserParams5.email,
            Slaptazodis: 'hashedPassword',
            Role: 'user',
        });

        await registerUser(mockRegisterUserParams5);

        expect(prisma.vartotojas.create).toHaveBeenCalledWith({
            data: {
                Vardas: mockRegisterUserParams5.name,
                Pavarde: mockRegisterUserParams5.surname,
                El_pastas: mockRegisterUserParams5.email,
                Slaptazodis: 'hashedPassword',
                Role: 'user',
            },
        });
    });
});

describe('deleteUser', () => {
    // Check if user is deleted
    const mockUserId = 1;

    it('should delete a user', async () => {
        await deleteUser(mockUserId);

        expect(prisma.vartotojas.delete).toHaveBeenCalledWith({
            where: {
                VartotojoID: mockUserId,
            },
        });
    });
});

describe('getAllUsers', () => {
    // Check if users are returned
    const mockPage = 1;
    const mockLimit = 20;
    const mockSearchTerm = '';

    it('should return users', async () => {
        await getAllUsers(mockPage, mockLimit, mockSearchTerm);

        expect(prisma.vartotojas.findMany).toHaveBeenCalledWith({
            skip: 0,
            take: 20,
            where: {
                OR: [
                    { VartotojoID: 0 },
                    { Vardas: { contains: '', mode: 'insensitive' } },
                    { Pavarde: { contains: '', mode: 'insensitive' } },
                    { El_pastas: { contains: '', mode: 'insensitive' } },
                    { Role: { contains: '', mode: 'insensitive' } },
                ],
            },
            select: {
                VartotojoID: true,
                Vardas: true,
                Pavarde: true,
                El_pastas: true,
                Role: true,
            },
        });
    });
});