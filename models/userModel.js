import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      requird: true,
    },
    email: {
      type: String,
      requird: true,
      unique: true,
    },
    password: {
      type: String,
      requird: true,
    },
    isAdmin: {
      type: Boolean,
      requird: true,
      default: false,
    },
  },
  { timestamps: true }
);

/* userSchema.methods.matchPassword = async function (entedPass) {
  return await bcrypt.compare(entedPass, this.password);
};

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
}); */

const User = mongoose.model('User', userSchema);
export default User;
