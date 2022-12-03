import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcrypt';

//@desc Register an user
//@route POST /api/users
//@access Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error('user already exists');
  }
  const hashPassword = await bcrypt.hash(password, 12);

  if (email && hashPassword) {
    var user = await User.create({
      name,
      email,
      password: hashPassword,
    });
  }
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    throw new Error('invalid user data');
  }
});

//@desc Auth user & get token
//@route POST /api/users/login
//@access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User does not exists' });

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect)
    return res.status(400).json({ message: 'invalid credentials' });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
});

//@desc Get user profile
//@route GET /api/users/profile
//@access private

const getUserProfile = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = req.user;
  //const user = await User.findOne({ email });
  res.json(user);
});

//@desc Update an user
//@route PUT /api/users/profile
//@access private

const updateUser = asyncHandler(async (req, res) => {
  const existingUser = await User.findById(req.user._id);

  if (existingUser) {
    existingUser.name = req.body.name || existingUser.name;
    existingUser.email = req.body.email || existingUser.email;
    if (req.body.password) {
      existingUser.password = req.body.password || existingUser.password;
    }

    const updatedUser = await existingUser.save();
    if (updatedUser) {
      res.status(201).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      throw new Error('invalid user data');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@desc Get all users
//@route GET /api/users/
//@access private/Admin

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ name: 1 });
  res.json(users);
});

//@desc Delete user
//@route DELETE /api/users/:id
//@access private/Admin

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (err) {
    res.status(404);
    throw new Error('User not found');
  }
});

//@desc Admin Update an user
//@route PUT /api/users/:id
//@access private

const updateUserById = asyncHandler(async (req, res) => {
  /*   const existingUser = await User.findById(req.params.id).select('-password');
  console.log('ex', ExistingUser); */

  try {
    const existingUser = await User.findById(req.params.id);

    if (existingUser) {
      console.log(req.body.isAdmin);
      //if (checkEmailAvailabie) throw new Error('This email is already used');
      existingUser.name = req.body.name || existingUser.name;
      existingUser.email = req.body.email || existingUser.email;
      existingUser.isAdmin = req.body.isAdmin;
      if (req.body.password) {
        existingUser.password = req.body.password || existingUser.password;
      }

      const updatedUser = await existingUser.save();
      if (updatedUser) {
        res.status(201).json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
        });
      } else {
        res.status(404);
        throw new Error('invalid user data');
      }
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (err) {
    res.status(404);
    throw new Error('something went wrong while updating the user', err);
  }
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404);
      throw new Error('Canot find the user');
    }
  } catch (err) {
    res.status(404);
    throw new Error('Someting went wrong while getting the user', err);
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUser,
  getUsers,
  deleteUser,
  updateUserById,
  getUserById,
};
