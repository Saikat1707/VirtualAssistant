import axios from './AxiosInstance';

export const geminiQuery = async (userPrompt) => {
  try {
    const res = await axios.post("/user/asktoassistant", { userPrompt });
    const { type, response, userInput, appName ,search_query } = res.data;

    console.log("Assistant Type: ", type);
    console.log("User Input:", userInput);
    console.log("Search Query : ",search_query)
    console.log("app_name: ",appName)
    const actionUrl = handleAction(type, userInput, appName, search_query);

    if (actionUrl) {
      console.log("action URL : ",actionUrl)
    }

    return {response , actionUrl};
  } catch (err) {
    console.error("Error in fetching response from Gemini:", err.response?.data?.message || err.message);
    throw new Error("Error in server");
  }
};



export const handleAction = (type, userInput, appName, search_query) => {
  switch (type) {
    case "search_command": {
      const query = encodeURIComponent(search_query?.toLowerCase() || "");
      switch (appName?.toLowerCase()) {
        case "google":
          return `https://www.google.com/search?q=${query}`;
        case "youtube":
          return `https://www.youtube.com/results?search_query=${query}`;
        case "bing":
          return `https://www.bing.com/search?q=${query}`;
        case "duckduckgo":
          return `https://duckduckgo.com/?q=${query}`;
        default:
          console.warn(`Unknown platform "${appName}", defaulting to Google`);
          return `https://www.google.com/search?q=${query}`;
      }
    }

    case "app_open": {
      return `https://www.${appName?.toLowerCase()}.com`;
    }

    default: {
      console.warn(`Unhandled action type: "${type}"`);
      return null;
    }
  }
};


