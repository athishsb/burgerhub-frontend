import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add items to your cart before proceeding.");
      return;
    }

    if (!currentUser) {
      alert("Please log in to proceed to checkout!");
      navigate("/login");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="container py-5">
      <h1
        className="text-center mb-5"
        style={{
          fontSize: "3.5rem",
          fontWeight: "700",
          color: "#ff7043",
          borderBottom: "3px solid #ff7043",
          paddingBottom: "10px",
          textTransform: "uppercase",
          letterSpacing: "2px",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        My Cart
      </h1>

      <div className="row justify-content-center">
        <div
          className="col-md-8"
          style={{
            maxHeight: "70vh",
            overflowY: "auto",
            paddingRight: "15px",
            marginBottom: "30px",
          }}
        >
          {cartItems.length === 0 ? (
            <h3 className="text-center" style={{ color: "#757575" }}>
              Your cart is empty!
            </h3>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={index}
                className="d-flex align-items-center justify-content-between shadow-lg p-3 mb-4 rounded"
                style={{
                  backgroundColor: "#fff3e0",
                  border: "1px solid #ffcc80",
                  borderRadius: "12px",
                  marginBottom: "20px",
                }}
              >
                <div className="d-flex flex-column" style={{ flex: 1 }}>
                  <h4
                    style={{
                      fontWeight: "600",
                      color: "#f57c00",
                      marginBottom: "10px",
                    }}
                  >
                    {item.name} <span>({item.variant})</span>
                  </h4>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "1rem",
                      color: "#5d4037",
                      fontWeight: "500",
                    }}
                  >
                    Price: {item.quantity} × ₹{item.prices[0][item.variant]} ={" "}
                    <span style={{ fontWeight: "700", color: "#ff7043" }}>
                      ₹{item.price}
                    </span>
                  </p>

                  <div className="d-flex align-items-center mt-2">
                    <button
                      className="btn btn-sm"
                      style={{
                        fontSize: "1.2rem",
                        marginRight: "10px",
                        backgroundColor: "#e8f5e9",
                        border: "1px solid #66bb6a",
                        color: "#388e3c",
                        borderRadius: "5px",
                      }}
                      onClick={() => {
                        dispatch(
                          addToCart({
                            burger: item,
                            quantity: 1,
                            variant: item.variant,
                          })
                        );
                      }}
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                    <span
                      className="mx-3"
                      style={{
                        fontWeight: "600",
                        fontSize: "1.4rem",
                        color: "#3e2723",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-sm ms-2"
                      style={{
                        fontSize: "1.2rem",
                        backgroundColor: "#ffebee",
                        border: "1px solid #ef5350",
                        color: "#d32f2f",
                        borderRadius: "5px",
                      }}
                      onClick={() => {
                        dispatch(
                          addToCart({
                            burger: item,
                            quantity: -1,
                            variant: item.variant,
                          })
                        );
                      }}
                    >
                      <i className="fa fa-minus"></i>
                    </button>
                  </div>
                </div>
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded"
                  style={{
                    height: "80px",
                    width: "80px",
                    objectFit: "cover",
                    border: "2px solid #ffcc80",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                />
                <button
                  className="btn btn-danger btn-sm"
                  style={{
                    padding: "10px",
                    fontSize: "1.2rem",
                    borderRadius: "5px",
                    marginLeft: "15px",
                    backgroundColor: "#f44336",
                    border: "none",
                  }}
                  onClick={() => {
                    dispatch(removeFromCart(item));
                  }}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="col-md-4">
          <div
            className="shadow-lg p-4"
            style={{
              backgroundColor: "#ffecb3",
              borderRadius: "15px",
              border: "1px solid #ffd54f",
            }}
          >
            <h4
              style={{
                fontWeight: "700",
                fontSize: "1.5rem",
                color: "#d84315",
                marginBottom: "20px",
              }}
            >
              Order Summary
            </h4>
            <hr />
            <p
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#3e2723",
              }}
            >
              Total Items:{" "}
              <span style={{ fontWeight: "700", color: "#ff7043" }}>
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </p>
            <p
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#3e2723",
              }}
            >
              Total Price:
              <span style={{ fontWeight: "700", color: "#ff7043" }}>
                {" "}
                ₹{cartItems.reduce((total, item) => total + item.price, 0)}
              </span>
            </p>
            <button
              className="btn btn-success w-100 mt-3"
              style={{
                padding: "12px",
                fontSize: "1.2rem",
                fontWeight: "600",
                borderRadius: "8px",
                background: "linear-gradient(90deg, #ff7043, #ff5722)",
                border: "none",
              }}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
