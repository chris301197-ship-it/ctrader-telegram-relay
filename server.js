import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Health check (Render lo usa)
app.get("/", (req, res) => {
  res.send("Relay online ✅");
});

app.post("/send", async (req, res) => {
  try {

    const text = req.body.text;

    if (!text) {
      return res.status(400).send("Missing text");
    }

    // Environment variables (sicure su Render)
    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const PARSER_CHAT_ID = process.env.PARSER_CHAT_ID;

    if (!TELEGRAM_TOKEN || !PARSER_CHAT_ID) {
      console.error("Missing environment variables");
      return res.status(500).send("Server not configured");
    }

    const telegramUrl =
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: PARSER_CHAT_ID,
        text: text
      })
    });

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      console.error(errorText);
      return res.status(500).send("Telegram error");
    }

    res.send("sent");

  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Relay started");
});
