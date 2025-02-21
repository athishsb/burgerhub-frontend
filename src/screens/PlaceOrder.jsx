import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearCart } from "../slices/cartSlice";
import {
  setProcessing,
  setError,
  setOrderDetails,
} from "../slices/checkoutSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PlaceOrder = ({ formData, totalAmount, validateForm }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { isProcessing, error } = useSelector((state) => state.checkout);
  const { currentUser } = useSelector((state) => state.user);

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      dispatch(setProcessing(true));

      const response = await axios.post(
        `${import.meta.env.VITE_BU}/payment/order`,
        {
          amount: totalAmount,
          name: formData.name,
          email: formData.email,
          orderItems: cartItems,
          phone: formData.phone,
          shippingAddress: formData.address,
          userId: formData.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      const data = response.data;

      if (data && data.data) {
        handlePaymentVerify(data.data);
      } else {
        dispatch(setError("Error creating order!"));
      }
    } catch (error) {
      console.error("Error during payment initiation:", error);
      const errorMessage =
        error.response?.data?.message || "Payment initiation failed.";
      toast.error(errorMessage);
      dispatch(setError(errorMessage));
    }
  };

  const handlePaymentVerify = async (data) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_API_KEY,
      amount: data.amount,
      currency: data.currency,
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyResponse = await axios.post(
            `${import.meta.env.VITE_BU}/payment/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: formData.userId,
            },
            {
              headers: {
                Authorization: `Bearer ${currentUser.token}`,
              },
            }
          );

          const verifyData = verifyResponse.data;

          if (verifyData.success) {
            dispatch(
              setOrderDetails({
                orderId: verifyData.orderId,
                ...formData,
                orderItems: cartItems,
                amount: totalAmount,
              })
            );
            toast.success("Payment successful!");
            dispatch(clearCart()); // Clear cart after successful payment
            navigate("/summary");
          } else {
            dispatch(setError("Payment verification failed."));
            toast.error("Payment verification failed.");
          }
        } catch (error) {
          console.error("Error during payment verification:", error);
          dispatch(setError("Payment verification failed."));
          toast.error("Payment verification failed.");
        } finally {
          dispatch(setProcessing(false)); // Ensure processing state is reset
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: "#ff7043" },
      modal: {
        ondismiss: () => {
          dispatch(setProcessing(false)); // Reset processing state if user dismisses
          toast.info("Payment cancelled");
        },
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="place-order-container">
      <button
        className="btn btn-success w-100 mt-4"
        onClick={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Place Order"}
      </button>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PlaceOrder;
