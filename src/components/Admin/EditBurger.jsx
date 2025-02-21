import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchBurgers,
  getBurgerById,
  updateBurger,
} from "../../slices/burgerSlice";
import { uploadImageToCloudinary } from "./uploadImage";
import { toast } from "react-toastify";

const EditBurger = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    selectedBurger: burger,
    loading,
    error,
  } = useSelector((state) => state.burgers);
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

  useEffect(() => {
    dispatch(getBurgerById({ id, token: currentUser.token }));
  }, [dispatch, id]);

  useEffect(() => {
    if (burger) {
      setName(burger.name);
      setDescription(burger.description);
      setCategory(burger.category);
      setSelectedVariants(burger.variants || []);
      setPrices(burger.prices?.[0] || {});
      setImage(burger.image);
      setImagePreview(burger.image);
    }
  }, [burger]);

  const handleVariantChange = (variant) => {
    if (selectedVariants.includes(variant)) {
      setSelectedVariants(selectedVariants.filter((v) => v !== variant));
      setPrices((prevPrices) => {
        const newPrices = { ...prevPrices };
        delete newPrices[variant];
        return newPrices;
      });
    } else {
      setSelectedVariants([...selectedVariants, variant]);
      setPrices((prevPrices) => ({ ...prevPrices, [variant]: "" }));
    }
  };

  const handlePriceChange = (variant, value) => {
    setPrices({ ...prices, [variant]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageLoading(true);
    setImagePreview(URL.createObjectURL(file));
    const imageUrl = await uploadImageToCloudinary(file);
    setImage(imageUrl);
    toast.info("Image uploaded successfully!");
    setImageLoading(false);
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

    const updatedBurger = {
      id,
      name,
      description,
      category,
      variants: selectedVariants,
      prices: [prices],
      image,
    };

    dispatch(
      updateBurger({ id, burgerData: updatedBurger, token: currentUser.token })
    );
    setTimeout(() => {
      dispatch(
        fetchBurgers({
          search: "",
          category: "",
        })
      );
      navigate("/admin/burgerslist");
    }, 1500);
  };

  return (
    <div className="container mt-3 mb-3">
      <h2 className="text-center mb-4">Edit Burger</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : (
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
            {loading ? "Updating..." : "Update Burger"}
          </button>

          {/* Go Back Button */}
          <button
            type="button"
            className="btn btn-secondary w-100 mt-2"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </form>
      )}
    </div>
  );
};

export default EditBurger;
