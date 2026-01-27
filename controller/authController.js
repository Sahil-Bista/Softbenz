import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../model/User.js';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    const error = new Error('No user with this email registered in te system');
    error.statusCode = 404;
    throw error;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const error = new Error('Incorrect password');
    error.statusCode = 401;
    throw error;
  }
  const access_token = jwt.sign(
    {
      UserInfo: {
        user: user._id,
        role: user.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' },
  );
  await user.save();
  return res.json({ access_token });
};
