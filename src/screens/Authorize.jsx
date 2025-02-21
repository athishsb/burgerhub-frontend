import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Authorize = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    if (!id || !token) {
      setMsg("Invalid password reset link.");
      toast.error("Password reset link is invalid.");
      setLoading(false);
      return;
    }

    const verifyUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BU}/users/reset-link-verify/${id}/${token}`
        );
        if (response.status === 200) {
          navigate(`/reset-password/${id}/${token}`);
        }
      } catch (error) {
        setMsg(error.response?.data?.message || "Error verifying link.");
        toast.error("Password reset link expired or invalid.");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [searchParams, navigate]);

  return (
    <div className="container text-center mx-auto my-5">
      {loading ? (
        <h6>Verifying reset link, please wait...</h6>
      ) : (
        <h6 className="text-danger">{msg}</h6>
      )}
      {/* Add the button with Bootstrap classes */}
      <div className="mt-3">
        <button onClick={() => navigate("/login")} className="btn btn-primary">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Authorize;
