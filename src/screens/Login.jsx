import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../slices/userSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, error } = useSelector((state) => state.user);

  // Validation logic
  const validate = () => {
    const newErrors = {};

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null }); // Clear specific field error on change
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form!");
      return;
    }

    dispatch(loginUser(formData));
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ height: "500px" }}
    >
      <div
        className="p-4 rounded shadow-lg"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#ffecb3",
          border: "1px solid #ffb74d",
          borderRadius: "12px",
        }}
      >
        <h2
          className="text-center mb-4"
          style={{
            color: "#ff7043",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={{
                border: "1px solid #ffcc80",
                borderRadius: "8px",
                padding: "10px",
              }}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={"form-control"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  border: "1px solid #ffcc80",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <div
                style={{
                  color: "#dc3545",
                  fontSize: "14px",
                  marginBottom: "10px",
                  marginTop: "5px",
                }}
              >
                {errors.password}
              </div>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="mb-3 text-end">
            <button
              type="button"
              className="btn btn-link"
              style={{
                color: "#ff7043",
                textDecoration: "none",
                fontSize: "1rem",
              }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              padding: "12px",
              fontSize: "1rem",
              background: "linear-gradient(90deg, #ff7043, #ff5722)",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
            }}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          {error && (
            <div className="text-danger text-center mt-3">
              <small>{error}</small>
            </div>
          )}
        </form>

        {/* Register Link */}
        <p
          className="text-center mt-2"
          style={{ color: "#757575", fontSize: "0.9rem" }}
        >
          {"Don't have an account? "}
          <a href="/register" style={{ color: "#ff7043", fontWeight: "600" }}>
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
