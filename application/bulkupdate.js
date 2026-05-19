const fetch = require("node-fetch"); // only needed if Node < 18

const baseURL = "https://inventory-1-k5dw.onrender.com/api/inventory";

// 20 dummy updates (using IDs 1–20)
async function bulkUpdate() {

  for (let i = 1; i <= 20; i++) {

    const data = {
      name: `Laptop-${i}-Updated`,
      category: "Laptop",
      quantity: Math.floor(Math.random() * 20) + 1,
      location: "Warehouse A",
      status: "Available",
      notes: "Bulk updated via API"
    };

    try {

      const res = await fetch(`${baseURL}/${i}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      console.log(`Updated ID ${i}:`, result);

    } catch (err) {
      console.log(`Error updating ID ${i}:`, err.message);
    }

  }

  console.log("✅ Bulk update completed");
}

bulkUpdate();