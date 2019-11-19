import getUserId from "../utils/getUserId";

const Query = {
  users(parent, args, { prisma, request }, info) {
    const { query, first, skip, after, orderBy } = args;
    const opArgs = { first, skip, after, orderBy };
    if (query) {
      opArgs.where = {
        OR: [{
          name_contains: query
        }]
      }
      ;
    }
    return prisma.query.users(opArgs, info);
  },

  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    return prisma.query.user({ where: { id: userId }});
  }
};

export default Query;