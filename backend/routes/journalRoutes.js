import express from "express";
import Journal from "../models/Journal.js";
import { analyzeEmotion } from "../services/llmService.js";

const router = express.Router();



/*
---------------------------------
1️⃣ CREATE JOURNAL ENTRY
POST /api/journal
---------------------------------
*/

router.post("/", async (req, res) => {
  try {

    const { userId, ambience, text } = req.body;

    const entry = new Journal({
      userId,
      ambience,
      text
    });

    await entry.save();

    res.json({
      message: "Journal saved",
      entry
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});



/*
---------------------------------
2️⃣ GET JOURNAL ENTRIES
GET /api/journal/:userId
---------------------------------
*/

router.get("/:userId", async (req, res) => {
  try {

    const entries = await Journal.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.json({
      entries
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});



/*
---------------------------------
3️⃣ LLM EMOTION ANALYSIS
POST /api/journal/analyze
---------------------------------
*/

router.post("/analyze", async (req, res) => {
  try {

    const { text } = req.body;

    const result = await analyzeEmotion(text);

    const parsed = JSON.parse(result);

    res.json(parsed);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});



/*
---------------------------------
4️⃣ ANALYZE + SAVE ENTRY
(Optional but powerful)
POST /api/journal/analyze-save
---------------------------------
*/

router.post("/analyze-save", async (req, res) => {
  try {

    const { userId, ambience, text } = req.body;

    const result = await analyzeEmotion(text);

    const parsed = JSON.parse(result);

    const entry = new Journal({

      userId,
      ambience,
      text,

      emotion: parsed.emotion,
      keywords: parsed.keywords,
      summary: parsed.summary

    });

    await entry.save();

    res.json({
      message: "Journal analyzed and saved",
      entry
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});



/*
---------------------------------
5️⃣ INSIGHTS API
GET /api/journal/insights/:userId
---------------------------------
*/

router.get("/insights/:userId", async (req, res) => {
  try {

    const entries = await Journal.find({
      userId: req.params.userId
    });

    const totalEntries = entries.length;

    const emotionCount = {};
    const ambienceCount = {};

    let allKeywords = [];



    entries.forEach((entry) => {

      if (entry.emotion) {

        emotionCount[entry.emotion] =
          (emotionCount[entry.emotion] || 0) + 1;

      }

      if (entry.ambience) {

        ambienceCount[entry.ambience] =
          (ambienceCount[entry.ambience] || 0) + 1;

      }

      if (entry.keywords) {

        allKeywords = allKeywords.concat(entry.keywords);

      }

    });



    const topEmotion =
      Object.keys(emotionCount)
      .sort((a, b) => emotionCount[b] - emotionCount[a])[0];



    const mostUsedAmbience =
      Object.keys(ambienceCount)
      .sort((a, b) => ambienceCount[b] - ambienceCount[a])[0];



    const recentKeywords =
      [...new Set(allKeywords)].slice(0, 5);



    res.json({

      totalEntries,
      topEmotion,
      mostUsedAmbience,
      recentKeywords

    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});



export default router;