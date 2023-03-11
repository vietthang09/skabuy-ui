import { useEffect, useState } from "react";
import { sendGetRequest, sendPostRequest } from "../../util/fetchAPI";
import { baseURL } from "../../util/constants";
import { useSelector } from "react-redux";
import { Empty } from "antd";
import { showToast } from "../../util/helper";
import { Link } from "react-router-dom";
import ProductItem from "../../components/ProductItem";
import Pagination from "../../components/Pagination";
var lastProductIndex;
var firstProductIndex;
var currentProducts;
export default function Wishlist() {
  const userRedux = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(16);
  async function getProducts() {
    const response = await sendGetRequest(
      `${baseURL}/wishlist/user/${userRedux.user.user_id}`
    );
    if (response.status == "success") {
      setProducts(response.data);
    } else {
      showToast("ERROR", response.message);
    }
  }
  useEffect(() => {
    getProducts();
  }, []);

  lastProductIndex = currentPage * productsPerPage;
  firstProductIndex = lastProductIndex - productsPerPage;
  currentProducts = products.slice(firstProductIndex, lastProductIndex);
  function ProductsSection() {
    return (
      <div>
        <div className="row">
          {currentProducts.map((product, index) => (
            <div
              className="col-4 col-lg-3 d-flex justify-content-center"
              key={index}
            >
              <ProductItem product={product} />
            </div>
          ))}
        </div>
        <Pagination
          totalProducts={products.length}
          productsPerPage={productsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    );
  }

  async function clearWishList() {
    const response = await sendPostRequest(`${baseURL}/wishlist/delete`);
    if (response.status == "success") {
      showToast("SUCCESS", "All products removed successful");
      getProducts();
    } else {
      showToast("ERROR", response.message);
    }
  }

  return (
    <div className="container mt-5 pt-5">
      {products.length > 0 ? (
        <>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-info rounded mb-3"
              onClick={() => {
                clearWishList();
              }}
            >
              Clear
            </button>
          </div>
          <ProductsSection />
        </>
      ) : (
        <Empty />
      )}
    </div>
  );
}
