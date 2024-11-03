// app/pages/api/sync/expenses/route.js
import { connectDB } from "@/app/services/db";
import Expense from "@/app/services/models/Expense";

export async function POST(req) {
  await connectDB();
  const { expenses } = await req.json();

  try {
    for (const expense of expenses) {
      await Expense.updateOne({ _id: expense._id }, expense, { upsert: true });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error syncing expenses:", error);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
