import { Outlet } from "react-router";
import AdminNav from "../components/AdminNav";

const AdminLayout = () => {
  return (
    <div>
      <AdminNav />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;