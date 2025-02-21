import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../../slices/orderSlice";
import DisplayOrders from "../DisplayOrder";

const OrderList = () => {
  const dispatch = useDispatch();
  const {
    items: orders,
    loading,
    error,
  } = useSelector((state) => state.orders);
  const { currentUser } = useSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 9; // Number of orders per page
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders({ token: currentUser.token }));
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(
      updateOrderStatus({
        id: orderId,
        status: newStatus,
        token: currentUser.token,
      })
    ).then(() => {
      // After updating the status, fetch the updated orders list again
      dispatch(fetchOrders({ token: currentUser.token }));
    });
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="container mt-2 mb-4">
      <h2 className="text-center mb-3" style={{ color: "#6c757d" }}>
        Orders List
      </h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-danger text-center">Error: {error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped text-center">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1 + (currentPage - 1) * ordersPerPage}</td>
                    <td>{order.razorpay_order_id}</td>
                    <td>{order.email.slice(0, 20) + "..."}</td>
                    <td>Rs.{order.amount}</td>
                    <td>{new Date(order.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          order.orderStatus === "Placed"
                            ? "bg-warning"
                            : order.orderStatus === "Processing"
                            ? "bg-info"
                            : order.orderStatus === "Out for Delivery"
                            ? "bg-primary"
                            : order.orderStatus === "Failed"
                            ? "bg-danger"
                            : "bg-success"
                        }`}
                        style={{
                          padding: "5px 10px",
                          fontSize: "14px",
                        }}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <div
                        className="d-flex align-items-center"
                        style={{
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Status Select */}
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="form-select form-select-sm"
                          disabled={order.statusAction === "Failed"} // Disable if failed
                          style={{
                            cursor:
                              order.statusAction === "Failed"
                                ? "not-allowed"
                                : "pointer",
                            marginRight: "10px",
                          }}
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Out for Delivery">
                            Out for Delivery
                          </option>
                          <option value="Delivered">Delivered</option>
                        </select>

                        {/* View Button */}
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() =>
                            setSelectedOrderId(order.razorpay_order_id)
                          }
                          style={{
                            backgroundColor: "#007bff",
                            borderColor: "#007bff",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-danger">
                    No Orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Display Order Details in Modal */}
      {selectedOrderId && (
        <DisplayOrders
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)} // Close the modal when onClose is triggered
        />
      )}

      {/* Pagination Controls */}
      {orders.length > ordersPerPage && (
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
      )}
    </div>
  );
};

export default OrderList;
