import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBurger } from "../../slices/burgerSlice";
import { uploadImageToCloudinary } from "./uploadImage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddNewBurger = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.burgers);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("veg");
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [prices, setPrices] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const availableVariants = ["small", "medium", "large"];

  // Handle variant selection
  const handleVariantChange = (variant) => {
    if (selectedVariants.includes(variant)) {
      // Remove variant
      setSelectedVariants(selectedVariants.filter((v) => v !== variant));
      setPrices((prevPrices) => {
        const newPrices = { ...prevPrices };
        delete newPrices[variant]; // Remove its price as well
        return newPrices;
      });
    } else {
      // Add variant
      setSelectedVariants([...selectedVariants, variant]);
      setPrices((prevPrices) => ({ ...prevPrices, [variant]: "" }));
    }
  };

  // Handle price input change
  const handlePriceChange = (variant, value) => {
    setPrices({ ...prices, [variant]: value });
  };

  // Handle Image Upload
  const handleImageUpload = async (e) => {
    setImage(null);
    setImagePreview(null);

    const file = e.target.files[0];
    if (!file) return;
    if (file) {
      setImageLoading(true);
      setImagePreview(URL.createObjectURL(file)); // Show preview
      const imageUrl = await uploadImageToCloudinary(file);
      setImage(imageUrl); // Set uploaded image URL
      toast.info("Image uploaded successfully!");
      setImageLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !image) {
      toast.error("Please fill all fields!");
      return;
    }
    if (selectedVariants.length === 0) {
      toast.error("Please select at least one variant!");
      return;
    }

    const newBurger = {
      name,
      description,
      category,
      variants: selectedVariants,
      prices: [prices],
      image,
    };
    dispatch(addBurger({ burgerData: newBurger, token: currentUser.token }));
    setTimeout(() => {
      navigate("/admin/burgerslist");
    }, 1500);
  };

  return (
    <div className="container mt-2 mb-4">
      <h2 className="text-center mb-3">Add New Burger</h2>
      <form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Burger Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Enter a short description..."
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="veg">Veg</option>
            <option value="nonveg">Non-Veg</option>
          </select>
        </div>

        {/* Variant Selection */}
        <div className="mb-3">
          <label className="form-label">Choose Variants</label>
          <div className="d-flex gap-3">
            {availableVariants.map((variant) => (
              <div key={variant} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={variant}
                  checked={selectedVariants.includes(variant)}
                  onChange={() => handleVariantChange(variant)}
                />
                <label className="form-check-label" htmlFor={variant}>
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Price Inputs */}
        {selectedVariants.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Set Prices</label>
            <div className="d-flex gap-2">
              {selectedVariants.map((variant) => (
                <input
                  key={variant}
                  type="number"
                  className="form-control"
                  placeholder={`Price for ${variant}`}
                  value={prices[variant] || ""}
                  onChange={(e) => handlePriceChange(variant, e.target.value)}
                  required
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2"
              width="150"
            />
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading || imageLoading}
        >
          {loading ? "Adding..." : "Add Burger"}
        </button>
        {error && <p className="text-danger text-center mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default AddNewBurger;
