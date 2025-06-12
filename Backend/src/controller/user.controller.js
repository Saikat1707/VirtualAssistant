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

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!userPrompt) {
      return res.status(400).json({ message: "User prompt is required" });
    }

    const result = await geminiResponse(userPrompt, user.virtualAssistantName, user.userName);

    if (!result) {
      return res.status(500).json({ message: "Failed to get response from assistant" });
    }

    // Attempt to extract and clean JSON from result
    const cleanedResult = result.trim().replace(/^```(?:json)?/, '').replace(/```$/, '').trim();

    let GeminiResponse;
    try {
      GeminiResponse = JSON.parse(cleanedResult);
    } catch (err) {
      return res.status(500).json({ message: "Invalid response format from assistant" });
    }
    
    const type = GeminiResponse.type || "unknown";
    const userInput = GeminiResponse.userInput;
    await User.findByIdAndUpdate(user._id, {
      $push: { searchHistory: userInput }
    });

    switch (type) {
      case "get_date":
        return res.status(200).json({
          type,
          userInput: GeminiResponse.userInput,
          response: moment().format('MMMM Do YYYY')
        });

      case "get_time":
        return res.status(200).json({
          type,
          userInput: GeminiResponse.userInput,
          response: moment().format('h:mm:ss a')
        });

      case "get_day":
        return res.status(200).json({
          type,
          userInput: GeminiResponse.userInput,
          response: moment().format('dddd')
        });

      case "get_month":
        return res.status(200).json({
          type,
          userInput: GeminiResponse.userInput,
          response: moment().format('MMMM')
        });

      case "get_year":
        return res.status(200).json({
          type,
          userInput: GeminiResponse.userInput,
          response: moment().format('YYYY')
        });

      case "google_search":
      case "youtube_search":
      case "general":
      case "youtube_play":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "twitter_open":
      case "weather_show":
      case "code":
        return res.status(200).json({
          type,
          userInput: GeminiResponse.userInput,
          response: GeminiResponse.response
        });

      default:
        return res.status(200).json({
          type: "unknown",
          userInput: GeminiResponse.userInput || userPrompt,
          response: "Sorry, I didn't understand that."
        });
    }
  } catch (error) {
    console.error("Error in askToAssistant:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
