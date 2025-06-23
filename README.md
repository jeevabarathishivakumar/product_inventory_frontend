# product_inventory_frontend
🛍️ Product Inventory Management - Frontend
This is the frontend of the Product Inventory Management App built with React, Vite, React Router, Axios, and Bootstrap. It allows users to:

View a list of products

Add new products

Edit existing products

Delete products

This frontend consumes a REST API from the backend service (Node.js + Express + MongoDB).

📁 Project Structure
client/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── api.js
├── index.html
├── vite.config.js
└── package.json
🚀 Features
📋 List all products in a responsive table

➕ Add new products via a form

✏️ Edit existing products with pre-filled form data

❌ Delete products with confirmation

✅ Form validation on the client side

🔄 API requests handled using Axios

🔔 Toast notifications using react-hot-toast

🎨 Styled using Bootstrap 5

🔧 Tech Stack
React 19

React Router DOM 7

Axios

Vite

Bootstrap 5

react-hot-toast

🛠️ Setup Instructions
1. Clone the repository
git clone https://github.com/your-username/product-inventory-app.git
cd product-inventory-app/client
2. Install dependencies
npm install


3. Run development server
npm run dev
