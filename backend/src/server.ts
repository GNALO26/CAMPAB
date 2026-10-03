// backend/src/server.ts
import mongoose from "mongoose";
import app from "./index.js";
import { env } from "./lib/env.js";

async function start(): Promise<void> {
  try {
    if (env.MONGODB_URI) {
      await mongoose.connect(env.MONGODB_URI);
      console.log("✅ MongoDB connecté");
    }

    app.listen(env.PORT, () => {
      console.log(`✅ Backend CAMPAB démarré sur le port ${env.PORT}`);
      console.log(`   Environnement : ${env.NODE_ENV}`);
      console.log(`   CORS autorisé : ${env.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error("❌ Erreur au démarrage :", error);
    process.exit(1);
  }
}

start();