import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";

const DisplayOrders = ({ orderId, onClose }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BU}/payment/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setOrderDetails(response.data.order[0]);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (!orderDetails) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh", textAlign: "center" }}
      >
        <h3>No order details found!</h3>
      </div>
    );
  }

  const {
    razorpay_order_id,
    name,
    email,
    phone,
    shippingAddress,
    orderItems,
    amount,
    updatedAt,
    orderStatus,
    statusAction,
  } = orderDetails;

  const orderDate = new Date(updatedAt);
  const formattedDate = orderDate.toLocaleDateString();
  const formattedTime = orderDate.toLocaleTimeString();

  return (
    <Modal show={true} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton style={{ backgroundColor: "#fff8e1" }}>
        <Modal.Title
          style={{
            color: "#ff7043",
            fontFamily: "'Roboto', sans-serif",
            fontSize: "1.8rem",
            fontWeight: "bold",
          }}
        >
          Order Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#fff8e1", padding: "15px" }}>
        {/* Order Header */}
        <div
          style={{
            background: "#fff3e0",
            border: "1px solid #ffcc80",
            borderRadius: "8px",
            padding: "10px 15px",
            marginBottom: "10px",
            fontSize: "0.95rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p>
              <strong>Order ID:</strong> {razorpay_order_id}
            </p>
            <p>
              <strong>
                {statusAction === "Failed" ? (
                  <span>
                    Payment:{" "}
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        fontSize: "1rem",
                      }}
                    >
                      Failed
                    </span>
                  </span>
                ) : (
                  <>
                    Status:{" "}
                    <span
                      style={{
                        color:
                          orderStatus === "Placed"
                            ? "blue"
                            : orderStatus === "Processing"
                            ? "orange"
                            : orderStatus === "Out for Delivery"
                            ? "#e21eb8"
                            : orderStatus === "Delivered"
                            ? "green"
                            : "black",
                        fontSize: "1rem",
                      }}
                    >
                      {orderStatus}
                    </span>
                  </>
                )}
              </strong>
            </p>
          </div>
          <p>
            <strong>Date:</strong> {formattedDate} &nbsp;|&nbsp;
            <strong>Time:</strong> {formattedTime}
          </p>
        </div>

        {/* Details Section */}
        <div className="row">
          {/* Customer Details */}
          <div className="col-md-6">
            <div
              style={{
                background: "#fff3e0",
                border: "1px solid #ffcc80",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                height: "100%",
              }}
            >
              <h6 style={{ color: "#d84315", marginBottom: "8px" }}>
                Customer Details
              </h6>
              <p>
                <strong>Name:</strong> {name}
              </p>
              <p>
                <strong>Email:</strong> {email}
              </p>
              <p>
                <strong>Phone:</strong> {phone}
              </p>
              <p>
                <strong>Address:</strong> {shippingAddress}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="col-md-6">
            <div
              style={{
                background: "#fff3e0",
                border: "1px solid #ffcc80",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              <h6 style={{ color: "#d84315", marginBottom: "8px" }}>
                Order Items
              </h6>
              <ul
                style={{
                  listStyle: "none",
                  paddingLeft: "0",
                  marginBottom: "0",
                }}
              >
                {orderItems.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      padding: "8px 0",
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #ffe0b2",
                    }}
                  >
                    <span>
                      {item.name} - {item.variant}
                    </span>
                    <span>
                      {item.quantity} x ₹{item.prices[0][item.variant]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div
          style={{
            marginTop: "10px",
            borderTop: "2px solid #ffcc80",
            paddingTop: "10px",
            fontSize: "0.95rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#795548",
              marginBottom: "5px",
            }}
          >
            <span>Subtotal</span>
            <span>
              ₹{orderItems.reduce((acc, item) => acc + item.price, 0)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#ff7043",
            }}
          >
            <span>Delivery Fee</span>
            <span>₹50</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "1rem",
              color: "#d84315",
              marginTop: "5px",
            }}
          >
            <span>Total</span>
            <span>₹{amount}</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#fff8e1", padding: "10px" }}>
        <Button
          variant="secondary"
          onClick={onClose}
          style={{
            backgroundColor: "#ff7043",
            color: "#fff",
            fontSize: "1rem",
            borderRadius: "8px",
            padding: "8px 16px",
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DisplayOrders;
