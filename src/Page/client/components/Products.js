import { Empty } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { baseURL } from "../../../util/constants";
import { sendPostRequest } from "../../../util/fetchAPI";
import { formatdolla, showToast } from "../../../util/helper";
import Product from "./Product";
import Stars from "./Stars";
const Products = ({ products, setUpdate }) => {
  const userRedux = useSelector((state) => state.user);
  const PriceDiscount = (price, discount) => {
    var prdc = price - price * (discount / 100);
    return prdc;
  };

  async function addToWishlist(productId) {
    var requestData = {
      data: {
        userId: userRedux.user.user_id,
        productId: productId,
      },
    };
    const response = await sendPostRequest(
      `${baseURL}/wishlist/create`,
      requestData
    );
    if (response.status == "success") {
      showToast("SUCCESS", response.data);
    } else {
      showToast("ERROR", response.message);
    }
  }

  async function removeFromWishlist(id) {
    var requestData = {
      data: {
        id: id,
      },
    };
    const response = await sendPostRequest(
      `${baseURL}/wishlist/delete`,
      requestData
    );
    if (response.status == "success") {
      showToast("SUCCESS", "Product removed successful");
      setUpdate(true);
    } else {
      showToast("ERROR", response.message);
    }
  }

  return (
    <>
      {products.length == 0 ? (
        <Empty
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      ) : (
        <div className="row">
          {products.map((product, index) => (
            <div className="col-6 col-lg-3 mb-3" key={index}>
              <Product product={product} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Products;
