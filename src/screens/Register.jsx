import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slices/userSlice";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();

  const { isLoading, error } = useSelector((state) => state.user);

  const validateForm = () => {
    const newErrors = {};
    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "Username is required.";
    } else if (formData.name.length < 3) {
      newErrors.name = "Username must be at least 3 characters.";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.name)) {
      newErrors.name =
        "Username can only contain letters and numbers, without spaces.";
    }

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password Validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else if (formData.password.includes(" ")) {
      newErrors.password = "Password should not contain any spaces.";
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null }); // Clear specific field error on change
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form!");
      return;
    }

    // Dispatch registration action
    dispatch(registerUser(formData));
  };

  return (
    <div
      style={{ height: "600px" }}
      className="container d-flex align-items-center justify-content-center"
    >
      <div
        className="p-4 rounded shadow-lg"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#fff3e0",
          border: "1px solid #ffb74d",
          borderRadius: "12px",
        }}
      >
        <h2
          className="text-center mb-3"
          style={{
            color: "#ff7043",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              style={{
                border: "1px solid #ffcc80",
                borderRadius: "8px",
                padding: "10px",
              }}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
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
          <div className="mb-3">
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className={"form-control"}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  border: "1px solid #ffcc80",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.confirmPassword && (
              <div
                style={{
                  color: "#dc3545",
                  fontSize: "14px",
                  marginBottom: "10px",
                  marginTop: "5px",
                }}
              >
                {errors.confirmPassword}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              padding: "12px",
              fontSize: "1rem",
              background: "linear-gradient(90deg, #ff7043, #ff5722)",
              border: "none",
              borderRadius: "8px",
              marginTop: "8px",
              fontWeight: "600",
            }}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          {error && (
            <div className="text-danger text-center mt-3">
              <small>{error}</small>
            </div>
          )}
        </form>
        <p
          className="text-center mt-3"
          style={{ color: "#757575", fontSize: "0.9rem" }}
        >
          Already have an account?{" "}
          <a href="/login" style={{ color: "#ff7043", fontWeight: "600" }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
