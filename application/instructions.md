# Inventory Management Frontend Design

## Purpose
Build a simple inventory management frontend for a generic hardware store or office asset tracker. The application should allow users to view and manage inventory items for:
- Laptops
- Desktops
- Phones

## Main Screens

### 1. Dashboard / Home
- Show a summary of total inventory count and counts by category.
- Provide quick links/buttons to "View Inventory", "Add Item", and category filters.

### 2. Inventory List
- Display a table or card list of inventory items.
- Each item should include:
  - Item name
  - Category (Laptop, Desktop, Phone)
  - Quantity
  - Location (optional / generic)
  - Status (Available, Assigned, In Repair)
- Add simple actions for each item: "Edit" and "Delete".
- Allow filtering by category and search by item name.

### 3. Add / Edit Item Form
- Use a single form for adding and updating items.
- Fields:
  - Item Name
  - Category (Laptop, Desktop, Phone)
  - Quantity
  - Location
  - Status
  - Notes (optional)
- Provide buttons for "Save" and "Cancel".

### 4. Item Details (Optional)
- If needed, show a simple detail view of a selected item.
- Display the same fields as the inventory list plus notes.

## UI Guidelines
- Keep the design clean and generic.
- Use a top navigation bar with links to the main pages.
- Keep category-specific behavior minimal and consistent.
- Use simple labels and buttons for clarity.

## Example Workflow
1. Open the dashboard to see inventory totals.
2. Go to the inventory list to review laptops, desktops, and phones.
3. Use the category filter to display only Laptops, Desktops, or Phones.
4. Add a new item with the form.
5. Edit or delete items from the list.

## Notes
- Do not implement backend logic yet.
- The backend should be planned later using SQLite to store inventory records.
- For now, focus on the frontend pages, navigation, and user flows.
