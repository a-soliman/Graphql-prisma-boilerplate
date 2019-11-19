import bcrypt from 'bcryptjs';

const hashPassword = async (password) => {
  if (password < 8) throw new Error('Password must be be 8 chars or longer');
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export default hashPassword;