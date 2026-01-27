import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ['User'],
    enum: ['User', 'Author'],
  },
});

export const UserModel = mongoose.Model('User', UserSchema);
