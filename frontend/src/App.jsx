import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Customers from "./pages/Customers";
import InvoicePrint from "./pages/InvoicePrint";

// Layout
import Layout from "./layout/Layout";

// Placeholder pages (create empty files for now)
import Products from "./pages/Products";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceList from "./pages/InvoiceList";
import Settings from "./pages/Settings";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes (No Sidebar) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Layout Routes */}
        <Route element={<Layout />}>
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/invoice/:id" element={<InvoicePrint />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
