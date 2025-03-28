import { Link } from "react-router";

const AdminNav = () => {
  return (
    <nav style={{ marginBottom: "20px" }}>
      <Link to="/admin/products">
        <button style={{ marginRight: "10px" }}>Produkter</button>
      </Link>
      <Link to="/admin/customers">
        <button style={{ marginRight: "10px" }}>Kunder</button>
      </Link>
      <Link to="/admin/orders">
        <button style={{ marginRight: "10px" }}>Ordrar</button>
      </Link>
      <Link to="/">
        <button style={{ marginRight: "10px" }}>E-shop</button>
      </Link>
    </nav>
  )
};

export default AdminNav;
