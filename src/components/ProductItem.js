import React from "react";
import { Link } from "react-router-dom";
import { discountPrice, formatdolla } from "../util/helper";
// import Stars from "./Stars";
export default function ProductItem({ product }) {
  return (
    <Link to={`/detailshop/${product.product_slug}`}>
      <div className="product-item rounded">
        <div className="product-item_content">
          {product.product_discount > 0 && (
            <span className="product-item_promo-flag">Instant Savings</span>
          )}
          <div className="d-flex justify-content-center">
            <img className="product-item_image" src={product.product_image} />
          </div>
          <h6 className="product-item_title">{product.product_name}</h6>
          {product.product_discount > 0 ? (
            <>
              <span className="product-item_saving">
                {`Save ${formatdolla(
                  product.product_price -
                    discountPrice(
                      product.product_price,
                      product.product_discount
                    ),
                  "$"
                )}`}
              </span>
              <span className="product-item_price">
                {formatdolla(
                  discountPrice(
                    product.product_price,
                    product.product_discount
                  ),
                  "$"
                )}
              </span>
              <sup>
                <span className="ml-1 product-item_saving_line">
                  {formatdolla(product.product_price, "$")}
                </span>
              </sup>
            </>
          ) : (
            <span className="product-item_price">
              {formatdolla(product.product_price, "$")}
            </span>
          )}
        </div>
      </div>
    </Link>
    // <>
    //   <Link to={`/detailshop/${product.product_slug}`}>
    //     <div className="border bg-light mx-2">
    //       <div className="d-flex align-items-center justify-content-center overflow-hidden py-3">
    //         <img
    //           src={product.product_image}
    //           alt=""
    //           style={{ width: 160, height: 160, objectFit: "contain" }}
    //         />
    //       </div>
    //       <div className="text-center py-2 px-2 text-truncate">
    //         <p
    //           style={{
    //             width: 200,
    //             overflow: "hidden",
    //             textOverflow: "ellipsis",
    //             fontSize: "15px",
    //             textAlign: "left",
    //           }}
    //         >
    //           {product.product_name}
    //         </p>
    //         {product.product_discount != "0" ? (
    //           <div className="d-flex align-items-center justify-content-start">
    //             <h5>
    //               {formatdolla(
    //                 PriceDiscount(
    //                   product.product_price,
    //                   product.product_discount
    //                 ),
    //                 "$"
    //               )}
    //             </h5>
    //             <h6 className="text-muted ml-2">
    //               <del> {formatdolla(product.product_price, "$")} </del>
    //             </h6>
    //           </div>
    //         ) : (
    //           <div className="d-flex align-items-center justify-content-start">
    //             <h5> {formatdolla(product.product_price, "$")} </h5>
    //           </div>
    //         )}
    //         <div className="d-flex align-items-center justify-content-start mb-1">
    //           <Stars stars={product.rating} />
    //           <small>
    //             {" "}
    //             {`(${
    //               product.comment_total != null ? product.comment_total : 0
    //             })`}{" "}
    //           </small>
    //         </div>
    //       </div>
    //     </div>
    //   </Link>
    // </>
  );
}
