import bycrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@gg.com',
    password: bycrypt.hashSync('123', 10),
    isAdmin: true,
  },
  {
    name: 'User one',
    email: 'userone@gg.com',
    password: bycrypt.hashSync('123', 10),
  },
  {
    name: 'User Two',
    email: 'usertwo@gg.com',
    password: bycrypt.hashSync('123', 10),
  },
];

export default users;
