import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { id, token } = useParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
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
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BU}/users/reset-password/${id}/${token}`,
        {
          password: formData.password,
        }
      );
      toast.success(response.data?.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Clear error messages on typing
  useEffect(() => {
    if (formData.password || formData.confirmPassword) {
      setErrors({});
    }
  }, [formData.password, formData.confirmPassword]);

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
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="mb-3">
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={"form-control"}
                placeholder="Enter new password"
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

          {/* Confirm Password */}
          <div className="mb-3">
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className={"form-control"}
                placeholder="Confirm new password"
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
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Back to Login */}
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

export default ResetPassword;
