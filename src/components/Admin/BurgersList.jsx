import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBurger, fetchBurgers } from "../../slices/burgerSlice";
import { Link } from "react-router-dom";

const BurgersList = () => {
  const dispatch = useDispatch();
  const {
    items: burgers,
    loading,
    error,
  } = useSelector((state) => state.burgers);
  const { currentUser } = useSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState(1);
  const burgersPerPage = 4; // Number of burgers per page

  useEffect(() => {
    dispatch(
      fetchBurgers({
        search: "",
        category: "",
      })
    );
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this burger?")) {
      dispatch(deleteBurger({ id, token: currentUser.token }));
    }
  };

  // Pagination logic
  const indexOfLastBurger = currentPage * burgersPerPage;
  const indexOfFirstBurger = indexOfLastBurger - burgersPerPage;
  const currentBurgers = burgers.slice(indexOfFirstBurger, indexOfLastBurger);
  const totalPages = Math.ceil(burgers.length / burgersPerPage);

  return (
    <div className="container mt-2 mb-4">
      <h2 className="text-center mb-3">Burgers List</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-danger text-center">Error: {error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBurgers.length > 0 ? (
                currentBurgers.map((burger, index) => (
                  <tr key={burger._id}>
                    <td>{index + 1 + (currentPage - 1) * burgersPerPage}</td>
                    <td>
                      <img
                        src={burger.image}
                        alt={burger.name}
                        width="150"
                        height="100"
                      />
                    </td>
                    <td>{burger.name}</td>
                    <td>{burger.category}</td>
                    <td>
                      {Object.entries(burger.prices[0]) // Convert price object to array
                        .filter(([, price]) => price) // Filter out empty prices
                        .map(([variant, price]) => (
                          <div key={variant}>
                            {variant.charAt(0).toUpperCase() + variant.slice(1)}
                            : {price}
                          </div>
                        ))}
                    </td>

                    <td>
                      <Link
                        to={`/admin/editBurger/${burger._id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(burger._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-danger">
                    No burgers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {burgers.length > burgersPerPage && (
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

export default BurgersList;
