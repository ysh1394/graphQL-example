const UserIds = ["roy", "jay"];
const randomIds = () => UserIds[Math.round(Math.random())];

export const mockMsgs = Array(50)
  .fill(0)
  .map((_, i) => ({
    id: 50 - i,
    userId: randomIds(),
    timestamp: 1234567890123 + (50 - i) * 1000 * 60,
    text: `${50 - i} mock test`,
  }));

// console.log(JSON.stringify(mockMsgs)); 목데이터 복사 용
