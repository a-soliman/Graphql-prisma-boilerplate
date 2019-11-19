import jwt from 'jsonwebtoken';

const getUserId = (request, requireAuth=true) => {
  let header;
  if (request.request) header = request.request.headers.authorization; // HTTP REQUEST
  else header = request.connection.context.Authorization; // WEB SOCKET REQUEST

  if (header) {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  }
  if (requireAuth) throw new Error('Authentication required');
  return null
};

export default getUserId;