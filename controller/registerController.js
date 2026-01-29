import { UserModel } from '../model/User.js';
import bcrypt from 'bcrypt';

//registers the users into the system
export const registerUser = async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    const error = new Error('A user with the same email already exists');
    error.statusCode = 409;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UserModel.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    role,
  });
  return res.json({ msg: 'New user regsitered successfully', data: newUser });
};
