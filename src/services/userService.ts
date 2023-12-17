import prisma from '../db/prismaClient';
import bcrypt from 'bcryptjs';

type RegisterUserParams = {
    name: string;
    surname: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export async function registerUser({ name, surname, email, password, confirmPassword, role }: RegisterUserParams & { role?: string }) {
    if (!email) {
        throw new Error("emailIsRequired");
    }

    if (password !== confirmPassword) {
        throw new Error("passwordsMustMatch");
    }

    const existingUser = await prisma.vartotojas.findUnique({
        where: {
            El_pastas: email,
        },
    });

    if (existingUser) {
        throw new Error("emailAlreadyExists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.vartotojas.create({
        data: {
            Vardas: name,
            Pavarde: surname,
            El_pastas: email,
            Slaptazodis: hashedPassword,
            Role: role || 'user',
        },
    });

    return newUser;
}

export async function getAllUsers(page = 1, limit = 20, searchTerm = '') {
    const startIndex = (page - 1) * limit;
    const numericSearchTerm = isNaN(Number(searchTerm)) ? undefined : Number(searchTerm);

    const users = await prisma.vartotojas.findMany({
        skip: startIndex,
        take: limit,
        where: {
            OR: [
                { VartotojoID: numericSearchTerm },
                { Vardas: { contains: searchTerm, mode: 'insensitive' } },
                { Pavarde: { contains: searchTerm, mode: 'insensitive' } },
                { El_pastas: { contains: searchTerm, mode: 'insensitive' } },
                { Role: { contains: searchTerm, mode: 'insensitive' } },
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

    const total = await prisma.vartotojas.count({
        where: {
            OR: [
                { VartotojoID: numericSearchTerm },
                { Vardas: { contains: searchTerm, mode: 'insensitive' } },
                { Pavarde: { contains: searchTerm, mode: 'insensitive' } },
                { El_pastas: { contains: searchTerm, mode: 'insensitive' } },
                { Role: { contains: searchTerm, mode: 'insensitive' } },
            ],
        },
    });

    return { users, total };
}

export async function deleteUser(userId: number) {
    await prisma.vartotojas.delete({
        where: {
            VartotojoID: userId,
        },
    });
}

export async function updateUser(userId: number, updateData: { Vardas: string; Pavarde: string; El_pastas: string; Role: string; }) {
    const updatedUser = await prisma.vartotojas.update({
        where: {
            VartotojoID: userId,
        },
        data: updateData,
    });

    return updatedUser;
}