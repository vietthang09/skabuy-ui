import React from "react";
import { Link } from "react-router-dom";
import { formatdolla } from "../../../util/helper";
import Stars from "./Stars";
const Product = ({ product }) => {
  const PriceDiscount = (price, discount) => {
    var prdc = price - price * (discount / 100);
    return prdc;
  };
  return (
    <>
      <Link to={`/detailshop/${product.product_slug}`}>
        <div className="product-item bg-light mx-2">
          <div className="product-img d-flex align-items-center justify-content-center overflow-hidden py-3">
            <img
              className="img-fluid"
              src={product.product_image}
              alt=""
              style={{ width: 160, height: 160, objectFit: "contain" }}
            />
          </div>
          <div className="text-center py-2 px-2 text-truncate">
            <p
              style={{
                width: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "15px",
                textAlign: "left",
              }}
            >
              {product.product_name}
            </p>
            {product.product_discount != "0" ? (
              <div className="d-flex align-items-center justify-content-start">
                <h5>
                  {formatdolla(
                    PriceDiscount(
                      product.product_price,
                      product.product_discount
                    ),
                    "$"
                  )}
                </h5>
                <h6 className="text-muted ml-2">
                  <del> {formatdolla(product.product_price, "$")} </del>
                </h6>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-start">
                <h5> {formatdolla(product.product_price, "$")} </h5>
              </div>
            )}
            <div className="d-flex align-items-center justify-content-start mb-1">
              <Stars stars={product.rating} />
              <small>
                {" "}
                {`(${
                  product.comment_total != null ? product.comment_total : 0
                })`}{" "}
              </small>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Product;
