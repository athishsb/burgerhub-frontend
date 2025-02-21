import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../../slices/userSlice";

const UserList = () => {
  const dispatch = useDispatch();
  const {
    currentUser,
    users,
    isLoading: loading,
    error,
  } = useSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 9; // Number of users per page

  useEffect(() => {
    dispatch(fetchUsers({ token: currentUser.token }));
  }, [dispatch]);

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser({ userId, token: currentUser.token })).then(() => {
        dispatch(fetchUsers({ token: currentUser.token })); // Refresh users after deletion
      });
    }
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="container mt-2 mb-4">
      <h2 className="text-center mb-3" style={{ color: "#6c757d" }}>
        Users List
      </h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover text-center">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date Joined</th>
                  <th>Admin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1 + (currentPage - 1) * usersPerPage}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span
                          style={{
                            color: user.isAdmin ? "red" : "green",

                            fontWeight: "700",
                          }}
                        >
                          {user.isAdmin ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(user._id)}
                          style={{
                            padding: "5px 10px",
                            fontSize: "14px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-danger">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {users.length > usersPerPage && (
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
        </>
      )}
    </div>
  );
};

export default UserList;
