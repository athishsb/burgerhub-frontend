import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { addToCart } from "../slices/cartSlice";
import { useDispatch } from "react-redux";

const Card = ({ burger }) => {
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState("");
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Set default variant to the first available variant
    if (burger.variants.length > 0) {
      setVariant(burger.variants[0]);
    }
  }, [burger.variants]);

  // Handle Modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addToCartBtn = () => {
    dispatch(addToCart({ burger, quantity: Number(quantity), variant }));
  };

  // Render Card
  return (
    <div
      className="card mb-4 shadow-lg"
      style={{
        maxWidth: "350px",
        margin: "auto",
        borderRadius: "15px",
        backgroundColor: "#fffbf2",
        border: "1px solid #ffcc80",
      }}
    >
      {/* Card Image */}
      <img
        src={burger.image}
        alt={burger.name}
        className="card-img-top"
        style={{
          height: "200px",
          objectFit: "cover",
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
        }}
        onClick={handleShow}
      />

      {/* Card Body */}
      <div className="card-body text-center">
        {/* Burger Name */}
        <h5
          className="card-title mb-3"
          style={{
            fontWeight: "700",
            color: "#f57c00",
          }}
        >
          {burger.name}
        </h5>

        {/* Variant and Quantity Selectors */}
        <div
          className="d-flex justify-content-between mb-4"
          style={{
            padding: "0 10px",
          }}
        >
          {/* Variant Selector */}
          <div className="w-50 me-2">
            <label
              className="form-label fw-bold text-muted"
              style={{
                fontSize: "0.9rem",
              }}
            >
              Variant
            </label>
            <select
              className="form-select text-center"
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              style={{
                backgroundColor: "#ffe0b2",
                color: "#5d4037",
                fontWeight: "600",
              }}
            >
              {burger.variants.map((variant, idx) => (
                <option key={idx} value={variant}>
                  {variant}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Selector */}
          <div className="w-50 ms-2">
            <label
              className="form-label fw-bold text-muted"
              style={{
                fontSize: "0.9rem",
              }}
            >
              Quantity
            </label>
            <select
              className="form-select text-center"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{
                backgroundColor: "#ffe0b2",
                color: "#5d4037",
                fontWeight: "600",
              }}
            >
              {[...Array(10).keys()].map((x, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Section */}
        <h6
          className="fw-bold"
          style={{
            color: "#d84315",
            fontSize: "1.3rem",
            marginBottom: "20px",
          }}
        >
          Price: ₹{burger.prices[0][variant] * quantity}
        </h6>

        {/* Add to Cart Button */}
        <button
          className="btn w-100"
          style={{
            padding: "12px",
            fontSize: "1rem",
            fontWeight: "600",
            color: "#ffffff",
            backgroundColor: "#d84315",
            border: "none",
            borderRadius: "5px",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#bf360c")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#d84315")}
          onClick={addToCartBtn}
        >
          Add to Cart
        </button>
      </div>

      {/* Modal Section */}
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
        animation
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "15px",
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title
            style={{
              color: "#f57c00",
              fontWeight: "700",
              textAlign: "center",
              width: "100%",
            }}
          >
            {burger.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            padding: "2rem",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          {/* Modal Image */}
          <div className="text-center">
            <img
              src={burger.image}
              alt={burger.name}
              className="img-fluid"
              style={{
                height: "400px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>

          {/* Burger Description */}
          <p
            style={{
              marginTop: "20px",
              color: "#3e2723",
              fontSize: "1.1rem",
              fontFamily: "'Roboto', sans-serif",
              lineHeight: "1.6",
            }}
          >
            {burger.description}
          </p>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Button
            variant="danger"
            onClick={handleClose}
            style={{
              backgroundColor: "#d84315",
              color: "#fff",
              borderRadius: "5px",
              fontWeight: "600",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#bf360c")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#d84315")}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Card;
