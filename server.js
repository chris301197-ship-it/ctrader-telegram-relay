import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Relay online ✅");
});

app.post("/send", async (req, res) => {

  try {

    const text = req.body.text;
    const target = req.body.target; // human o parser

    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

    let chatId;

    if (target === "human") {
      chatId = process.env.HUMAN_CHAT_ID;
    } 
    else if (target === "parser") {
      chatId = process.env.PARSER_CHAT_ID;
    } 
    else {
      return res.status(400).send("Invalid target");
    }

    const telegramUrl =
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
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
