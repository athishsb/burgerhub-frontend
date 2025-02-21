import { useEffect, useState } from "react";
import axios from "axios";
import DisplayOrders from "../components/DisplayOrder";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]); // List of all orders
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5; // Number of orders per page

  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser._id;

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BU}/payment/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setOrders(response.data.orders);
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    };
    fetchOrders();
  }, [userId]);

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="container mt-5">
      <h2
        className="text-center mb-4"
        style={{ color: "#ff5722", fontSize: "2rem" }}
      >
        Your Orders
      </h2>
      {orders.length === 0 ? (
        <p className="text-center text-muted">No orders found.</p>
      ) : (
        <div>
          <div className="row">
            {currentOrders.map((order) => (
              <div
                key={order.razorpay_order_id}
                className="col-md-6 col-lg-4 mb-4"
              >
                <div
                  className="card shadow-sm"
                  style={{
                    borderRadius: "10px",
                    cursor: "pointer",
                    backgroundColor: "#fff3e0",
                    border: "1px solid #ffcc80",
                  }}
                  onClick={() => setSelectedOrderId(order.razorpay_order_id)}
                >
                  <div className="card-body">
                    <h5
                      className="card-title"
                      style={{
                        color: "#ff7043",
                        fontSize: "1.3rem",
                        fontWeight: "bold",
                      }}
                    >
                      Order ID: {order.razorpay_order_id}
                    </h5>
                    <p className="card-text">
                      <strong>Date:</strong>{" "}
                      {new Date(order.updatedAt).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                      <strong>Time:</strong>{" "}
                      {new Date(order.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="card-text">
                      <strong>Total:</strong> ₹{order.amount}
                    </p>
                    <p
                      className="card-text"
                      style={{
                        color:
                          order.orderStatus === "Placed"
                            ? "blue"
                            : order.orderStatus === "Processing"
                            ? "orange"
                            : order.orderStatus === "Out for Delivery"
                            ? "#e21eb8"
                            : order.orderStatus === "Delivered"
                            ? "green"
                            : "black",
                      }}
                    >
                      <strong>Status:</strong> {order.orderStatus}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-outline-primary mx-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span className="align-self-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline-primary mx-2"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Display Order Details in Modal */}
      {selectedOrderId && (
        <DisplayOrders
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
};

export default Orders;
