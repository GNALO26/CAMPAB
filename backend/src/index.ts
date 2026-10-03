// backend/src/index.ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 10000

// ============================================================
// MIDDLEWARES
// ============================================================
app.use(helmet())
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://cam-pab.com',
    'https://www.cam-pab.com',
  ],
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes, veuillez réessayer plus tard.',
})
app.use('/api/', limiter)

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  })
})

// ============================================================
// ROUTES (à compléter selon vos besoins)
// ============================================================
// app.use('/api/portfolio', portfolioRoutes)
// app.use('/api/articles', articleRoutes)
// app.use('/api/upload', uploadRoutes)
// app.use('/api/auth', authRoutes)

// ============================================================
// ERREUR 404
// ============================================================
app.use((_, res) => {
  res.status(404).json({ error: 'Route non trouvée' })
})

// ============================================================
// CONNEXION MONGODB + DÉMARRAGE
// ============================================================
async function start() {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log('✅ MongoDB connecté')
    }

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`)
      console.log(`🌍 Environnement : ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('❌ Erreur au démarrage :', error)
    process.exit(1)
  }
}

start()