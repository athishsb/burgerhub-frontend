import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrderSummary = () => {
  const navigate = useNavigate();
  const orderDetails = useSelector((state) => state.checkout.orderDetails);

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

  const { orderId, name, email, address, phone, orderItems, amount } =
    orderDetails;

  return (
    <div
      className="container mt-4 p-4"
      style={{
        backgroundColor: "#fff8e1",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "850px",
        margin: "auto",
      }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#ff7043",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          Order Summary
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#1E88E5",
          }}
        >
          <strong>Order ID:</strong> {orderId}
        </p>
      </div>

      {/* Customer Details */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <h4 style={{ color: "#d84315" }}>Customer Details</h4>
          <p>
            <strong>Name:</strong>{" "}
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Phone:</strong> {phone}
          </p>
          <p>
            <strong>Address:</strong> {address}
          </p>
        </div>

        {/* Order Items */}
        <div className="col-md-6">
          <h4 style={{ color: "#d84315" }}>Items Ordered</h4>
          <ul
            className="list-group"
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              padding: "0",
              listStyle: "none",
              margin: "0",
            }}
          >
            {orderItems.map((item, index) => (
              <li
                key={index}
                style={{
                  background: "#fff3e0",
                  border: "1px solid #ffcc80",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {item.name} <small>({item.variant})</small>
                </span>
                <span>
                  {item.quantity} x ₹{item.prices[0][item.variant]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pricing */}
      <div className="mt-4">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "1.2rem",
            color: "#795548",
            borderTop: "2px solid #ffcc80",
            paddingTop: "10px",
          }}
        >
          <span>Subtotal</span>
          <span>₹{orderItems.reduce((acc, item) => acc + item.price, 0)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "1.2rem",
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
            fontSize: "1.4rem",
            fontWeight: "bold",
            color: "#d84315",
            marginTop: "10px",
          }}
        >
          <span>Total</span>
          <span>₹{amount}</span>
        </div>
      </div>

      {/* Button */}
      <div className="text-center mt-4">
        <button
          onClick={() => navigate("/")}
          className="btn btn-lg"
          style={{
            background: "linear-gradient(to right, #ff7043, #ff5722)",
            color: "#fff",
            padding: "12px 24px",
            fontSize: "1.2rem",
            borderRadius: "8px",
          }}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
