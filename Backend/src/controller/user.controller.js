import { json } from "express";
import { updateDao } from "../DAO/updateDao.js";
import { geminiResponse } from "../service/GeminiRespose.js";
import moment from "moment/moment.js";
import User from "../models/user.models.js";

export const getCurrentUser = (req,res)=>{
    const user = req.user
    if(!user){
        return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(201).json({message: "user retrieved successfully",data:user})
}

export const updateUser = async (req,res)=>{
    const {virtualAssistantName} = req.body
    const localFilePath = req.file?.path || null
    const user = req.user
    if(!user){
        return res.status(401).json({ message: "Unauthorized" });
    }
    if(!virtualAssistantName){
        return res.status(400).json({ message: "Virtual Assistant Name is required" });
    }
    const updatedUser = await updateDao(user._id,virtualAssistantName,localFilePath)
    if(!updatedUser){
        return res.status(500).json({ message: "Failed to update user" });
    }
    return res.status(200).json({message: "User updated successfully",data:updatedUser})
}



export const askToAssistant = async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const user = req.user;

    // Authentication and validation
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!userPrompt || typeof userPrompt !== 'string') {
      return res.status(400).json({ message: "Valid user prompt is required" });
    }

    // Get structured response from Gemini
    const result = await geminiResponse(
      userPrompt,
      user.virtualAssistantName,
      user.userName
    );

    if (!result) {
      return res.status(500).json({ message: "Assistant service unavailable" });
    }

    // Parse and clean the JSON response
    let parsedResponse;
    try {
      const cleanedResult = result.trim()
        .replace(/^```(?:json)?/, '')
        .replace(/```$/, '')
        .trim();
      parsedResponse = JSON.parse(cleanedResult);
    } catch (err) {
      console.error("Response parsing error:", err);
      return res.status(500).json({ message: "Invalid assistant response format" });
    }

    // Destructure with defaults
    console.log("parsed Response : ")
    console.log(parsedResponse)
    const {
      type = "unknown",
      userInput = userPrompt,
      response = "Sorry, I couldn't understand that.",
      appName = null,
      search_query = null
    } = parsedResponse;

    try {
      await User.findByIdAndUpdate(user._id, {
        $push: { 
          searchHistory: userInput
        }
      });
    } catch (dbError) {
      console.error("History save error:", dbError);
    }

    // Handle date/time intents
    const timeIntents = {
      get_date: moment().format('MMMM Do YYYY'),
      get_time: moment().format('h:mm:ss a'),
      get_day: moment().format('dddd'),
      get_month: moment().format('MMMM'),
      get_year: moment().format('YYYY')
    };

    if (timeIntents[type]) {
      return res.status(200).json({
        type,
        userInput,
        response: timeIntents[type]
      });
    }

    // const appName2 = parsedResponse['appName?'] || null;
    // console.log("app Name is : ",appName2)
    // Handle app opening
    if (type === "app_open") {
      if (!appName) {
        return res.status(200).json({
          type: "unknown",
          userInput,
          response: "Please specify an app to open"
        });
      }
      return res.status(200).json({
        type,
        userInput,
        response: `Opening ${appName}`,
        appName: appName.toLowerCase()
      });
    }

    // const search_query2 = parsedResponse['search_query?'] || null;
    // const appName3 = parsedResponse['appName?'] || null;
    // Handle search commands
    if (type === "search_command") {
      if (!search_query|| !appName) {
        return res.status(200).json({
          type: "unknown",
          userInput,
          response: "Please specify both search terms and platform"
        });
      }
      return res.status(200).json({
        type,
        userInput,
        response: `Searching for "${search_query}" on ${appName}`,
        appName: appName.toLowerCase(),
        search_query
      });
    }

    // Handle other supported intents
    const supportedIntents = [
      "code",
      "task_command",
      "general"
    ];

    if (supportedIntents.includes(type)) {
      return res.status(200).json({
        type,
        userInput,
        response
      });
    }

    // Fallback for unknown intents
    return res.status(200).json({
      type: "unknown",
      userInput,
      response
    });

  } catch (error) {
    console.error("Assistant error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};