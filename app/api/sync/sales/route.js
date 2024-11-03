// app/pages/api/sync/sales/route.js
import { connectDB } from "@/app/services/db";
import Sale from "@/app/services/models/Sale";

export async function POST(req) {
  await connectDB();
  const { sales } = await req.json();

  try {
    for (const sale of sales) {
      await Sale.updateOne({ _id: sale._id }, sale, { upsert: true });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error syncing sales:", error);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
