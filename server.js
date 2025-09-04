const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");



const authRoutes = require('./routes/authRoutes')
const AssetRoutes = require('./routes/assetRoutes')
const ParlourRoutes = require('./routes/parlourRoutes')
const BookingRoutes = require('./routes/bookingRoutes')
const gamesRoutes = require('./routes/gamesRoutes')

const connectDB = require("./config/db");

dotenv.config();


(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to connect to DB:', err.message);
    process.exit(1);
  }
})();

const app = express();
app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.send(" Hello World from GameLobby API");
});


app.use("/api/auth",authRoutes)
app.use('/api/parlour',AssetRoutes)
app.use('/api/parlour',ParlourRoutes)
app.use('/api/user',BookingRoutes)
app.use('/api/game',gamesRoutes)


app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
