import { hash, compare } from 'bcrypt';
const encryptPassword = async (password) => {
    const saltRounds = 10;
    const hashPassword = await hash(password, saltRounds);
    return hashPassword;
}

const comparePassword = async (password, hashPassword) => {
    return await compare(password, hashPassword);
}

export default {
    encryptPassword, comparePassword
}