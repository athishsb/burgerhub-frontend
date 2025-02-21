import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearUser } from "../slices/userSlice";
import { clearCart } from "../slices/cartSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    dispatch(clearCart());
    dispatch(clearUser());
    toast.info("Logged Out!");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light shadow-md p-3 mb-4"
      style={{
        backgroundColor: "#ffcc80",
        borderRadius: "10px",
      }}
    >
      {/* Brand */}
      <Link
        className="navbar-brand fw-bold"
        to="/"
        style={{ fontSize: "1.8rem", color: "#d84315" }}
      >
        BurgerHub
      </Link>

      {/* Toggler for mobile */}
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Navbar Links */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {/* Conditional Login/Logout */}
          {currentUser ? (
            <div className="dropdown">
              <a
                className="dropdown-toggle"
                style={{
                  textDecoration: "none",
                  color: "#5d4037",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  marginTop: "10px",
                  marginRight: "15px",
                }}
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {currentUser.name}
              </a>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
                style={{
                  backgroundColor: "#ffcc80",
                  borderRadius: "10px",
                }}
              >
                {currentUser && currentUser.isAdmin && (
                  <Link
                    className="dropdown-item"
                    to="/admin"
                    style={{
                      color: "#5d4037",
                      fontWeight: "600",
                      fontSize: "1rem",
                      textDecoration: "none",
                    }}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  className="dropdown-item"
                  to="/orders"
                  style={{
                    color: "#5d4037",
                    fontWeight: "600",
                    fontSize: "1rem",
                    textDecoration: "none",
                  }}
                >
                  Orders
                </Link>
                <Link
                  className="dropdown-item"
                  to="/login"
                  onClick={handleLogout}
                  style={{
                    color: "#5d4037",
                    fontWeight: "600",
                    fontSize: "1rem",
                    textDecoration: "none",
                  }}
                >
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="nav-link"
              style={{
                color: "#5d4037",
                fontWeight: "600",
                fontSize: "1.1rem",
              }}
            >
              Login
            </Link>
          )}

          {/* Cart Link */}
          <li className="nav-item">
            <Link
              to="/cart"
              className="nav-link"
              style={{
                color: "#5d4037",
                fontWeight: "600",
                fontSize: "1.1rem",
              }}
            >
              Cart ({cartState.cartItems.length || 0})
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
