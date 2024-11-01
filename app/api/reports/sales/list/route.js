// bm-day-book/app/api/reports/sales/route.js
import { connectDB } from "@/app/services/db";
import Sale from "@/app/services/models/Sale";

// Named export for the GET method to list today's sale entries
export const GET = async (req) => {
  await connectDB(); // Ensure database connection is established

  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Set time to the start of the day
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Set time to the end of the day

    // Fetch all sales entries for today, sorted by date descending
    const sales = await Sale.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ date: -1 });

    return new Response(JSON.stringify(sales), { status: 200 });
  } catch (error) {
    console.error("Error fetching sales entries:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

export const PUT = async (req, { params }) => {
  await connectDB(); // Ensure database connection is established

  try {
    const saleData = await req.json(); // Parse JSON data from request body

    console.log("Updating sale entry:", saleData.id, saleData);
    // Update the sale in the database
    const updatedSale = await Sale.findByIdAndUpdate(saleData.id, saleData, {
      new: true,
    });

    if (!updatedSale) {
      return new Response(JSON.stringify({ message: "Sale not found." }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedSale), { status: 200 });
  } catch (error) {
    console.error("Error updating sale entry:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
