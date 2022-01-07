import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";

const fetcher = async (method, url, ...rest) => {
  const res = await axios[method](url, ...rest);
  return res.data;
};

// ...rest로 마지막 인자를 쓰는 이유는 get, delete는 data인자가 필요없지만 put, post는 바디에 데이터를 받아야하기때문에 두가지 모두 대응하기 위한방법
// get : axios.get(url[, config])
// delete : axios.delete(url[, config])
// post : axios.post(url, data[, config])
// put : axios.put(url, data[, config])

export default fetcher;
