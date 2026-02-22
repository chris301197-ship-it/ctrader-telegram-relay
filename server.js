import express from "express";
import fetch from "node-fetch";

const app = express();

app.use(express.json());

// health check (Render lo usa automaticamente)
app.get("/", (req, res) => {
  res.send("Relay online ✅");
});

app.post("/send", async (req, res) => {

  try {

    const text = req.body.text;

    if (!text) {
      return res.status(400).send("Missing text");
    }

    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    const telegramUrl =
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text
      })
    });

    res.send("sent");

  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Relay started"));