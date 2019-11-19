import getUserId from "../utils/getUserId";
// Individual fields resolvers takes control after the data is parsed from db
const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false);
      if ( userId &&  parent.id === userId) return parent.email;
      return null;
    }
  },
  password: {
    resolve(parent, args, { request }, info) {
      return '********';
    }
  }
};

export default User;