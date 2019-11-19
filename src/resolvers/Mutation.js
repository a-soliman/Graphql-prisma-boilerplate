import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generateAuthToken from '../utils/generateAuthToken';
import hashPassword from '../utils/hashPassword';


const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const { name, email, password } = args.data;

    const userExists = await prisma.exists.User({ email: email });
    if (userExists) throw new Error('Email taken');

    const hashedPassword = await hashPassword(password);
    const user = await prisma.mutation.createUser({
      data: {
        name, email, password: hashedPassword
      }
    });
    const token = generateAuthToken(user.id);
    return { user, token };
  },

  async login(parent, args, { prisma }, info) {
    const { email, password } = args.data;

    const userExists = await prisma.exists.User({ email });
    if (!userExists) throw new Error('Invalid email or password');

    const user = await prisma.query.user({ where: { email }});

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) throw new Error('Invalid email or password');
    const token = generateAuthToken(user.id);
    return { user, token }
  },

  async deleteUser(parent, args,  { prisma, request }, info) {
    const userId = getUserId(request);
    return prisma.mutation.deleteUser({ where: { id: userId } }, info);
  },

  async updateUser(parent, args, { prisma, request }, info) {
    const { data } = args;
    const userId = getUserId(request);
    return prisma.mutation.updateUser({ where: { userId }, data }, info);
  },

  async changeUserPassword(parent, args, { prisma, request }, info) {
    const { oldPassword, newPassword1, newPassword2 } = args.data;

    if (newPassword1 !== newPassword2) throw new Error('Passwords don\'t match');
    const userId = getUserId(request);
    const user = await prisma.query.user({
      where: { id: userId }
    });

    const isCorrectPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isCorrectPassword) throw new Error('Invalid old password');

    const hashedPassword = await hashPassword(newPassword1);
    const data = { password: hashedPassword };

    return prisma.mutation.updateUser({ where: { id: userId },data }, info);
  }
};

export default Mutation;
