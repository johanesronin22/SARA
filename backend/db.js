import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'users.json');

const initDB = async () => {
    try {
        await fs.access(DB_PATH);
    } catch {
        await fs.writeFile(DB_PATH, JSON.stringify({ users: [] }, null, 2));
    }
};

const getData = async () => {
    const content = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(content);
};

const saveData = async (data) => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

export const findUserByEmail = async (email) => {
    const data = await getData();
    return data.users.find(u => u.email === email);
};

export const createUser = async (user) => {
    const data = await getData();
    data.users.push(user);
    await saveData(data);
    return user;
};

// Initialize the database file
initDB();
