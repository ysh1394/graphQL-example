const userResolver = {
  Query: {
    users: (parent, args, { db }) => Object.values(db.users), // 데이터가 객체이기때문에 배열로 반환할 수 있도록 변환
    user: (parent, { id = "" }, { db }) => db.users[id],
  },
};

export default userResolver;
