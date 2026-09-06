import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import "./redis/client.js";
import "./models/index.js";

const PORT = process.env.PORT || 5000;

await connectDatabase();

app.listen(PORT, () => {
  console.log(`SmartBus API running on port ${PORT}`);
});
