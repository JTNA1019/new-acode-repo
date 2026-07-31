require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

// ==============================
// 🔌 قاعدة البيانات
// ==============================

const connectDB = require("./db");

// ==============================
// 📦 Models
// ==============================
const globalLeaderboards = require("./commands/leaderboards");

const User = require("./models/User");
const Admin = require("./models/Admin");

// ==============================
// 📦 الأوامر
// ==============================

const userCommands = require("./commands/commandsUser");
const adminCommands = require("./commands/commandsAdmin");
const gameCommands = require("./commands/commandsGames");

// ==============================
// 🔑 التوكن
// ==============================

const token = process.env.Teregram_Jtna_bot;

// ==============================
// 🔌 تشغيل DB
// ==============================

connectDB();

// ==============================
// 🤖 إنشاء البوت
// ==============================

const bot = new TelegramBot(token, { polling: true });

console.log("✅ Telegram Bot Running...");

// ==============================
// 🎮 تحميل جميع الألعاب تلقائياً
// ==============================

const fs = require("fs");
const path = require("path");

const GAMES_DIR = path.join(__dirname, "games");

if (fs.existsSync(GAMES_DIR)) {

    const gameFolders = fs.readdirSync(GAMES_DIR)
        .filter(f => fs.statSync(path.join(GAMES_DIR, f)).isDirectory());

    gameFolders.forEach(folder => {

        const gameFile = path.join(GAMES_DIR, folder, "game.js");

        if (fs.existsSync(gameFile)) {
            const startGame = require(gameFile);
            startGame(User, bot);
            console.log(`🎮 Loaded game: ${folder}`);
        }
    });
}

// ==============================
// 📦 تحميل الأوامر
// ==============================

userCommands(bot, User);
adminCommands(bot, User, Admin);
gameCommands(bot, User);
globalLeaderboards(bot, User);
