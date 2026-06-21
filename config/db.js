// ============================================================
// TechShop Backend — Connexion à MongoDB (sans options dépréciées)
// Fichier : config/db.js
// ============================================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
    console.log(`📦 MongoDB : ${process.env.MONGO_URI}`);
  } catch (err) {
    console.error(`❌ Erreur connexion MongoDB : ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
