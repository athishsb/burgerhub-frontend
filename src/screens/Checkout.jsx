import { useState } from "react";
import { useSelector } from "react-redux";
import PlaceOrder from "./PlaceOrder";

const Checkout = () => {
  const { currentUser } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [formData, setFormData] = useState({
    userId: currentUser._id || "",
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const deliveryFee = 50;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const totalAmount = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.address.trim() || formData.address.length < 10)
      errors.address = "Address must be at least 10 characters.";
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone))
      errors.phone = "Valid 10-digit phone number is required.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Order placed successfully!");
      console.log(formData);
    }
  };

  return (
    <div
      className="container mt-5 mb-5"
      style={{
        backgroundColor: "#ffecb3",
        borderRadius: "15px",
        padding: "25px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h1
        className="text-center mb-5"
        style={{
          fontSize: "3rem",
          fontWeight: "700",
          color: "#ff7043",
          borderBottom: "3px solid #ff7043",
          paddingBottom: "10px",
          textTransform: "uppercase",
          letterSpacing: "2px",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        Checkout
      </h1>

      <div className="row">
        {/* Left Column: Delivery Details */}
        <div className="col-md-6 mb-4">
          <h3
            style={{
              fontSize: "1.6rem",
              fontWeight: "700",
              color: "#d84315",
              marginBottom: "20px",
            }}
          >
            Delivery Details
          </h3>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows="3"
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                value={formData.address}
                onChange={handleInputChange}
              />
              {errors.address && (
                <div className="invalid-feedback">{errors.address}</div>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                value={formData.phone}
                onChange={handleInputChange}
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="col-md-6">
          <div
            className="shadow-lg p-4"
            style={{
              backgroundColor: "#fff8e1",
              borderRadius: "12px",
              border: "1px solid #ffd54f",
            }}
          >
            <h3
              style={{
                fontSize: "1.6rem",
                fontWeight: "700",
                color: "#d84315",
                marginBottom: "20px",
              }}
            >
              Order Summary
            </h3>
            <div
              className="order-items mb-3"
              style={{
                maxHeight: "150px",
                overflowY: "auto",
                marginBottom: "15px",
              }}
            >
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="d-flex justify-content-between align-items-center p-2"
                  style={{
                    backgroundColor: "#fff3e0",
                    border: "1px solid #ffcc80",
                    borderRadius: "5px",
                    marginBottom: "8px",
                  }}
                >
                  <span>
                    {item.name} <span>({item.variant})</span> x {item.quantity}
                  </span>
                  <span>₹{item.quantity * item.price}</span>
                </div>
              ))}
            </div>

            <div
              className="d-flex justify-content-between align-items-center p-2"
              style={{
                fontWeight: "600",
                fontSize: "1rem",
                color: "#795548",
              }}
            >
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div
              className="d-flex justify-content-between align-items-center p-2"
              style={{
                fontWeight: "600",
                fontSize: "1rem",
                color: "#ffa726",
              }}
            >
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div
              className="d-flex justify-content-between align-items-center p-2"
              style={{
                fontWeight: "700",
                fontSize: "1.2rem",
                color: "#d84315",
                borderTop: "2px solid #ffd54f",
                marginTop: "10px",
                paddingTop: "10px",
              }}
            >
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            {/* Place Order Button */}
            <PlaceOrder
              formData={formData}
              totalAmount={totalAmount}
              validateForm={validateForm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
