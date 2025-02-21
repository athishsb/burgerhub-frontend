import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./screens/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cart from "./screens/Cart";
import Register from "./screens/Register";
import Login from "./screens/Login";
import Checkout from "./screens/Checkout";
import OrderSummary from "./screens/OrderSummary";
import Orders from "./screens/Orders";
import DisplayOrders from "./components/DisplayOrder";
import AdminScreen from "./screens/AdminScreen";
import UserList from "./components/Admin/UserList";
import BurgersList from "./components/Admin/BurgersList";
import AddNewBurger from "./components/Admin/AddNewBurger";
import OrderList from "./components/Admin/OrderList";
import EditBurger from "./components/Admin/EditBurger";
import ForgotPassword from "./screens/ForgotPassword";
import ResetPassword from "./screens/ResetPassword";
import Authorize from "./screens/Authorize";
import axios from "axios";

function App() {
  axios.get(import.meta.env.VITE_BC);
  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <ToastContainer position="bottom-right" autoClose={3000} />

      {/* App Wrapper */}
      <div style={{ backgroundColor: "#fffbf2", minHeight: "100vh" }}>
        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/authorize" element={<Authorize />} />
          <Route
            path="/reset-password/:id/:token"
            element={<ResetPassword />}
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/summary" element={<OrderSummary />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/display" element={<DisplayOrders />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminScreen />}>
            <Route path="" element={<UserList />} />
            <Route path="burgerslist" element={<BurgersList />} />
            <Route path="addnewBurger" element={<AddNewBurger />} />
            <Route path="orderlist" element={<OrderList />} />
            <Route path="editBurger/:id" element={<EditBurger />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
