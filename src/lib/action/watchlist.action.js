import { Watchlist } from "../../../database/models/watchlist.model";
import { connectToDatabase } from "../../../database/mongoose";

export async function getWatchlistSymbolsByEmail(email) {
  if (!email) return [];
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db();
    if (!db)
      throw new Error("Mongodb connection not found getWtchListSymbolsByEmail");
    // better auth stores users in the "user" collection.
    const user = await db.collection("user").findOne({ email });
    if (!user) return [];
    const userId = user.id || user._id || "";
    if (!userId) return [];
    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => i.symbol);
  } catch (error) {
    console.error("getWatchListSymbleByEmail error", error);
    return [];
  }
}
