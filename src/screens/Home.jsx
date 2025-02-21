import { useEffect, useState } from "react";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { fetchBurgers } from "../slices/burgerSlice";

const Home = () => {
  const dispatch = useDispatch();
  const {
    items: burgers,
    loading,
    error,
  } = useSelector((state) => state.burgers);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [filters, setFilters] = useState({ search: "", category: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const burgersPerPage = 6; // Number of burgers per page

  useEffect(() => {
    dispatch(fetchBurgers(filters));
  }, [dispatch, filters]);

  const handleSearch = () => {
    // Trigger search only when the button is clicked
    setFilters({ search: searchTerm, category });
    setCurrentPage(1); // Reset to the first page after search
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Pagination logic
  const indexOfLastBurger = currentPage * burgersPerPage;
  const indexOfFirstBurger = indexOfLastBurger - burgersPerPage;
  const currentBurgers = burgers.slice(indexOfFirstBurger, indexOfLastBurger);
  const totalPages = Math.ceil(burgers.length / burgersPerPage);

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-danger" style={{ marginTop: "20vh" }}>
        <h3>Error Loading Burgers</h3>
        <p>{error}</p>
      </div>
    );

  // Check if no results found after filters
  const noResults = burgers.length === 0 && searchTerm;

  return (
    <div
      className="container mt-4"
      style={{
        maxWidth: "1200px",
        backgroundColor: "#fffbf2",
        borderRadius: "15px",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        className="text-center mb-4"
        style={{
          color: "#f57c00",
          fontWeight: "700",
          fontFamily: "'Poppins', sans-serif",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
        }}
      >
        Discover Our Delicious Burgers
      </h1>

      {/* Filters Section */}
      <div
        className="row mb-4 d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: "#ffe0b2",
          borderRadius: "10px",
          padding: "10px 20px",
        }}
      >
        <div className="col-md-4 col-12 mb-3 mb-md-0">
          <input
            type="text"
            className="form-control"
            placeholder="Search burgers..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              borderRadius: "8px",
              border: "1px solid #ffcc80",
              padding: "8px 12px",
              fontSize: "0.9rem",
              width: "100%",
            }}
          />
        </div>
        <div className="col-md-3 col-6 mb-3 mb-md-0">
          <select
            className="form-control"
            value={category}
            onChange={handleCategoryChange}
            style={{
              borderRadius: "8px",
              border: "1px solid #ffcc80",
              padding: "8px 12px",
              fontSize: "0.9rem",
              width: "100%",
            }}
          >
            <option value="">All Categories</option>
            <option value="veg">Veg</option>
            <option value="nonveg">Non-Veg</option>
          </select>
        </div>
        <div className="col-md-2 col-6">
          <button
            className="btn btn-primary w-100"
            style={{
              backgroundColor: "#d84315",
              border: "none",
              borderRadius: "5px",
              padding: "8px 12px",
              fontWeight: "600",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#bf360c")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#d84315")}
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* No Results Message */}
      {noResults && (
        <div className="text-center text-danger mb-4">
          <h4>No burgers found matching your search.</h4>
          <p>Try a different search term or clear your filters.</p>
        </div>
      )}

      {/* Burgers Display */}
      {!noResults && (
        <div className="row g-4">
          {currentBurgers.map((burger) => (
            <div className="col-md-4 col-sm-6" key={burger._id}>
              <Card burger={burger} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!noResults && burgers.length > 0 && (
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-outline-primary mx-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span className="align-self-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline-primary mx-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
