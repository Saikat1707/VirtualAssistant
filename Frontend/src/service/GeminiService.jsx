import axios from './AxiosInstance';

export const geminiQuery = async (userPrompt) => {
  try {
    const res = await axios.post("/user/asktoassistant", { userPrompt });
    console.log(res.data.type)
    return res.data.response;
  } catch (err) {
    console.error("Error in fetching response from Gemini:", err.response?.data?.message || err.message);
    throw new Error("Error in server");
  }
};
