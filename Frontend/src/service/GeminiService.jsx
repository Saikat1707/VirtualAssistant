import axios from './AxiosInstance'

export const geminiQuery = async (userPrompt)=>{
    await axios.post("/user/asktoassistant",{userPrompt})
    .then((res)=>{
        return res.data;
    })
    .catch((err)=>{
        console.log("Error in fetching response from Gemini : "+err.response.data.message)
        throw new Error("Error in server");
        
    })
}