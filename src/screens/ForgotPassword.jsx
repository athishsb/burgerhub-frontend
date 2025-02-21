import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value.trim());
    setErrors({ ...errors, email: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the error in the form!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BU}/users/forgot-password`,
        { email }
      );
      toast.success(response.data?.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
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
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Enter your registered email"
              value={email}
              onChange={handleInputChange}
              style={{
                border: "1px solid #ffcc80",
                borderRadius: "8px",
                padding: "10px",
              }}
              disabled={loading}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
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
              fontWeight: "600",
            }}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p
          className="text-center mt-2"
          style={{ color: "#757575", fontSize: "0.9rem" }}
        >
          <button
            className="btn btn-link"
            style={{
              color: "#ff7043",
              textDecoration: "none",
              fontWeight: "600",
            }}
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
