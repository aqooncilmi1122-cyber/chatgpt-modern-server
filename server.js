import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("ChatGPT Modern server is running.");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, lang } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const systemMessage =
      "You are ChatGPT Modern. Always reply in the user's language.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
