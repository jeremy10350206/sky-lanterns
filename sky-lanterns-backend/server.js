require('dotenv').config(); // 讀取 .env

const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

// 測試是否從 .env 成功讀到 SPREADSHEET_ID
console.log("📌 SPREADSHEET_ID:", process.env.SPREADSHEET_ID);

// 新 Service Account 憑證：請改為真正的檔名
const KEY_FILE = "sky-lanterns-service-0a4612e7f5b6.json";

// 讀取憑證 JSON
const credentials = JSON.parse(fs.readFileSync(KEY_FILE));

// 設定 Google Sheets API 權限範圍
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// 建立 JWT Client
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  SCOPES
);

// 建立 Sheets 客戶端
const sheets = google.sheets({ version: "v4", auth });

// 從 .env 讀取 SPREADSHEET_ID
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const app = express();
app.use(express.json());
app.use(cors());

// POST /save-wish：將願望寫入試算表
app.post("/save-wish", async (req, res) => {
  try {
    const wish = req.body.wish;
    if (!wish) {
      return res.status(400).json({ error: "請提供願望內容！" });
    }

    // 寫入試算表的 A 欄
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "A:A",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[wish]],
      },
    });

    console.log(`✅ 願望已儲存: ${wish}`);
    res.json({ message: "願望已成功儲存！" });
  } catch (error) {
    // 回傳更完整錯誤訊息
    console.error("❌ 儲存願望時發生錯誤：", error.response ? error.response.data : error.message);
    res.status(500).json({
      error: "無法儲存願望，請稍後再試！",
      details: error.response ? error.response.data : error.message
    });
  }
});
const path = require("path");
const publicDir = path.join(__dirname, "./");
app.get("/", async (req, res) => {
  res.sendFile(path.join(publicDir, "3D-Sky-Lanterns.html"));
});
// 監聽埠號 (預設 .env 裡的 PORT=3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 伺服器運行中: http://localhost:${PORT}`);
});
