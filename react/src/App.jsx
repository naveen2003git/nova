import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./Auth/Auth";
import ProductPage from "./Users/ProductPage/ProductPage";
import Navbar from "./Users/Navbar/Navbar";
import AddToCartPage from "./Users/AddToCartPage/AddToCartPage";
import ProductDetails from "./Users/ProductDetails/ProductDetails";
import PaymentPage from "./Users/PaymentPage/Paymentpage";
import OrdersPage from "./Users/OrderPage/OrdersPage";
import About from "./Users/About/About";
import Profile from "./Users/Profile/Profile";
import TermsOfService from "./component/TermsOfService";
import PrivacyPolicy from "./component/privacyPolicy";
import FAQ from "./component/FAQ";
import { ThemeProvider } from "./ThemeContext/ThemeContext"
import OrderDetails from "./Users/OrderPage/OrderDetails";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<Auth />} />
          {/* Public Route - Product Page as Homepage */}
          <Route path="/" element={<><Navbar /><ProductPage /></>} />

          


          {/* User Routes wrapped with User Navbar */}
          <Route path="/user" element={<Navbar />}>
            <Route path="AddToCartPage" element={<AddToCartPage />} />
            <Route path="/user/productdetails/:id" element={<ProductDetails />} />
            <Route path="/user/payment" element={<PaymentPage />} />
            <Route path="/user/orders" element={<OrdersPage />} />
            <Route path="/user/order/:id" element={<OrderDetails />} />
            <Route path="/user/about" element={<About />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/terms-of-service" element={<TermsOfService />} />
            <Route path="/user/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/user/faq" element={<FAQ />} />
          </Route>

        </Routes>
      </Router>
    </ThemeProvider>

  );
};

export default App;
