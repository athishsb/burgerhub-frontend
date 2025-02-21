import { useEffect } from "react";
import { Row, Col, Container, ButtonGroup, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";

const AdminScreen = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (localStorage.getItem("currentUser") === null || !currentUser.isAdmin) {
      navigate("/");
    }
  }, [navigate, currentUser]);

  return (
    <>
      <Container>
        <Row>
          <h1
            className="text-center bg-primary text-light p-2 rounded shadow"
            style={{ fontSize: "28px" }}
          >
            Admin Panel
          </h1>
          <Col md={2}>
            <ButtonGroup
              vertical
              style={{
                minHeight: "500px",
                marginTop: "70px",
                gap: "15px",
                borderRadius: "10px",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              <Button
                onClick={() => navigate("")}
                variant="outline-primary"
                className="btn-lg"
                style={{
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                All Users
              </Button>
              <Button
                onClick={() => navigate("burgerslist")}
                variant="outline-success"
                className="btn-lg"
                style={{
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                All Burgers
              </Button>
              <Button
                onClick={() => navigate("addnewBurger")}
                variant="outline-warning"
                className="btn-lg"
                style={{
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Add New Burger
              </Button>
              <Button
                onClick={() => navigate("orderlist")}
                variant="outline-danger"
                className="btn-lg"
                style={{
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                All Orders
              </Button>
            </ButtonGroup>
          </Col>
          <Col md={10}>
            {/* This is where the nested route components will be rendered */}
            <Outlet />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminScreen;
