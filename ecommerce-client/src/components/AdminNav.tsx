import { Link } from "react-router";
import '../styles/base.css'

const AdminNav = () => {
  return (
    <nav className="admin-nav-style">
      <Link to="/admin/products">
        <button className="admin-nav-btn">Produkter</button>
      </Link>

      <Link to="/admin/customers">
        <button className="admin-nav-btn">Kunder</button>
      </Link>

      <Link to="/admin/orders">
        <button className="admin-nav-btn">Ordrar</button>
      </Link>

      <Link to="/">
        <button className="admin-nav-btn">E-shop</button>
      </Link>
    </nav>
  )
};

export default AdminNav;
