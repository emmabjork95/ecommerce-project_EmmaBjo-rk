import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { IProduct } from "../../types/IProduct";
import { deleteProduct, getProducts } from "../../services/apiProducts";
import '../../styles/AdminProducts.css';


const AdminProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Fel vid hämtning av produkter:", error);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Fel vid borttagning av produkt:", error);
    }
  };

  return (
    <div className="admin-products">
      <h1 className="admin-header">Produkthantering</h1>
      <button onClick={() => navigate ("/admin/create")} className="create-product-btn" style={{marginBottom: "20px"}}> Skapa produkt</button>
      <table className="product-table">
        <thead>
            <tr>
                <th>Bild</th>
                <th>Namn</th>
                <th>Pris</th>
                <th>Lager</th>
                <th>Kategori</th>
                <th>Åtgärder</th>
            </tr>
        </thead>
        <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>
                <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px"}}
                />
            </td>
            <td>{product.name}</td>
            <td>{product.price}</td>
            <td>{product.stock}</td>
            <td>{product.category}</td>
            <td className="product-actions-admin">
                <button className="edit-button-admin" onClick={() => navigate(`/admin/edit/${product.id}`)}>Redigera</button>
                <button className="delete-button-admin" onClick={() => handleDelete(product.id)} >
                    Radera
                </button>
            </td>
            </tr>
        ))}
        </tbody>
        </table>
        </div>
  );
};


export default AdminProducts;
