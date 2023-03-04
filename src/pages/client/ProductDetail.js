import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import * as fetchAPI from "../../util/fetchAPI";
import { formatdolla, showToast, discountPrice } from "../../util/helper";
import CommentList from "./components/CommentList";
import Pagination from "../../components/Pagination";
import { baseURL, productSliderSettings } from "../../util/constants";
import ProductCharacterictis from "../../components/ProductCharacterictis";
import Stars from "../../components/Stars";
import ProductItem from "../../components/ProductItem";
import Slider from "react-slick";
var lastCommentIndex;
var firstCommentIndex;
var currentComments;
const imagesSliderSettings = {
  arrows: false,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function ProductDetail() {
  const { slug } = useParams();

  const userRedux = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [characterictis, setCharacterictis] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [recommendProducts, setRecommendProducts] = useState([]);
  const [productInfor, setProductInfor] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(6);

  async function loadProductInfo() {
    const response = await fetchAPI.sendGetRequest(
      `${baseURL}/product/get-product-by-slug/${slug}`
    );
    if (response.status == "error") {
      showToast("ERROR", response.message);
    } else {
      setProductInfor(response.data);
      loadComments(response.data.product_id);
      loadCharacterictis(response.data.product_id);
      loadRelatedProducts(response.data.category_id);
    }
  }

  async function loadCharacterictis(productId) {
    const response = await fetchAPI.sendGetRequest(
      `${baseURL}/attribute/id/${productId}`
    );
    if (response.status == "error") {
      showToast("ERROR", response.message);
    } else {
      setCharacterictis(response.data);
    }
  }

  const loadComments = async (productId) => {
    const response = await fetchAPI.sendGetRequest(
      `${baseURL}/comment/product/${productId}`
    );
    if (response.status == "success") {
      setComments(response.data);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  };
  async function loadRelatedProducts(category_id) {
    const response = await fetchAPI.sendGetRequest(
      `${baseURL}/product/related/${category_id}`
    );
    setRecommendProducts(response.data);
  }

  useEffect(() => {
    loadProductInfo();
  }, [slug]);

  // handle when click on submit comment button
  const onCreateCommentHandler = async () => {
    if (comment === "") {
      showToast("ERROR", "You have not entered a comment yet!!");
    } else {
      const postData = {
        user_id: userRedux.user.user_id,
        comment_content: comment,
        comment_star: rating,
        product_id: productInfor.product_id,
      };
      const response = await fetchAPI.sendPostRequest(
        `${baseURL}/comment/create`,
        postData
      );
      if (response.status == "success") {
        setComment("");
        loadProductInfo();
        showToast("SUCCESS", "You comment is posted!");
      } else {
        showToast("ERROR", "There are some mistake!");
      }
    }
  };

  lastCommentIndex = currentPage * productsPerPage;
  firstCommentIndex = lastCommentIndex - productsPerPage;
  currentComments = comments.slice(firstCommentIndex, lastCommentIndex);

  function ProductImagesSection() {
    return (
      <div className="p-5">
        <Slider {...imagesSliderSettings}>
          <img
            className="w-100 h-100"
            src={productInfor.product_image}
            alt="Image"
          />

          <img
            className="w-100 h-100"
            src={productInfor.image_description1}
            alt="Image"
          />

          <img
            className="w-100 h-100"
            src={productInfor.image_description2}
            alt="Image"
          />
        </Slider>
      </div>
    );
  }

  function ProductInfoSection() {
    return (
      <div>
        {productInfor.product_discount > 0 && (
          <>
            <span
              className="text-white rounded px-2 font-weight-bold"
              style={{ background: "rgb(176, 0, 0)" }}
            >
              Instant Savings
            </span>
            <span className="h5 d-block text-danger">
              {`${formatdolla(
                productInfor.product_price -
                  discountPrice(
                    productInfor.product_price,
                    productInfor.product_discount
                  ),
                "$"
              )} off with Instant Savings`}
            </span>
          </>
        )}
        <h3>{productInfor.product_name}</h3>
        <div className="d-flex">
          <Stars stars={productInfor.rating} />
          <small className="pt-1">
            {`(${
              productInfor.comment_total != undefined
                ? productInfor.comment_total
                : "0"
            } Reviews)`}
          </small>
        </div>
        {productInfor.product_discount ? (
          <>
            <span className="h1 font-weight-bold">
              {formatdolla(
                discountPrice(
                  productInfor.product_price,
                  productInfor.product_discount
                ),
                "$"
              )}
            </span>
            <sup
              className="ml-1 font-weight-bold"
              style={{ textDecorationLine: "line-through" }}
            >
              {formatdolla(productInfor.product_price, "$")}
            </sup>
            <small className="d-block text-danger font-weight-bold">
              {`Save ${formatdolla(
                productInfor.product_price -
                  discountPrice(
                    productInfor.product_price,
                    productInfor.product_discount
                  ),
                "$"
              )}`}
            </small>
          </>
        ) : (
          <h3 className="font-weight-semi-bold mb-4">
            {formatdolla(productInfor.product_price, "$")}
          </h3>
        )}

        <ProductCharacterictis
          productInfo={productInfor}
          characterictis={characterictis}
        />

        <div>
          <span>Share on: </span>
          <img src="/icons/facebook.png" />
          <img className="ml-1" src="/icons/messenger.png" />
          <img className="ml-1" src="/icons/pinterest.png" />
          <img className="ml-1" src="/icons/twitter.png" />
        </div>

        <div className="row">
          <div className="col-6">
            <table border="0" cellspacing="0">
              <tr>
                <td align="center"></td>
              </tr>
              <tr>
                <td>
                  <a
                    href="https://www.paypal.com/webapps/mpp/paypal-popup"
                    title="How PayPal Works"
                    onclick="javascript:window.open('https://www.paypal.com/webapps/mpp/paypal-popup','WIPaypal','toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=1060, height=700'); return false;"
                  >
                    <img
                      src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_mc_vs_dc_ae.jpg"
                      border="0"
                      alt="PayPal Acceptance Mark"
                    />
                  </a>
                </td>
              </tr>
            </table>
          </div>
          <div className="col-6 d-flex align-items-center">
            <img
              style={{ width: "100%" }}
              src="https://static.tildacdn.com/tild6333-3965-4332-b730-663930356132/secure-stripe-paymen.png"
            />
          </div>
        </div>

        <div className="row mt-3 d-none d-lg-flex">
          <div className="col-4">
            <div className="p-2 border rounded shadow-sm">
              <img src="/icons/encrypted.png" />
              <span className="d-block font-weight-bold">
                Refund 111% if found fake
              </span>
            </div>
          </div>
          <div className="col-4">
            <div className="p-2 border rounded shadow-sm">
              <img src="/icons/like.png" />
              <span className="d-block font-weight-bold">
                Open the delivery check box
              </span>
            </div>
          </div>
          <div className="col-4">
            <div className="p-2 border rounded shadow-sm">
              <img src="/icons/product-return.png" />
              <span className="d-block font-weight-bold">Return in 7 days</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function RelatedProductsSection() {
    return (
      <div className="mt-2">
        <h5>Related Products</h5>
        <Slider {...productSliderSettings}>
          {recommendProducts.map((item) => {
            return <ProductItem product={item} />;
          })}
        </Slider>
      </div>
    );
  }

  function DescriptionSection() {
    return (
      <div className="mt-5 p-4 bg-white rounded">
        <h5>Description</h5>
        <hr />
        <div>{parse(productInfor.product_description)}</div>
      </div>
    );
  }

  function CommentsSection() {
    return (
      <div className="mt-5 p-4 bg-white rounded">
        <h5>Reviews ({comments.length})</h5>

        {userRedux.user !== undefined && userRedux.user !== null ? (
          <div className="row" style={{ padding: "30px" }}>
            <div className="col-md-6">
              {comments && comments.length > 0 && (
                <CommentList comments={currentComments} />
              )}
              <Pagination
                totalProducts={comments.length}
                productsPerPage={productsPerPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            </div>
            <div className="col-md-6">
              <h4 className="mb-4">Leave a review</h4>
              <div>
                <div className="form-group">
                  <label htmlFor="name">Your Name :</label>{" "}
                  <b>{userRedux.user.user_fullname}</b>
                </div>
                <div className="d-flex form-group">
                  <p className="mb-0 mr-2">Your Rating * :</p>
                  <div className="text-primary">
                    {[...Array(5)].map((star, index) => {
                      index += 1;
                      return (
                        <i
                          key={index}
                          className={`${
                            index <= rating ? "fas" : "far"
                          } fa-star`}
                          onClick={() => setRating(index)}
                          onDoubleClick={() => {
                            setRating(0);
                          }}
                        ></i>
                      );
                    })}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Your Review *</label>
                  <textarea
                    id="message"
                    cols="30"
                    rows="5"
                    className="form-control"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-group mb-0">
                  <button
                    className="btn btn-info px-3"
                    onClick={() => onCreateCommentHandler()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row" style={{ padding: "20px" }}>
            <div className="col-md-12">
              {comments && comments.length > 0 && (
                <CommentList comments={currentComments} />
              )}
              <Pagination
                totalProducts={comments.length}
                productsPerPage={productsPerPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <>
      {productInfor ? (
        <div className="container mt-lg-5 pt-5">
          <div className="row bg-white p-2 rounded">
            <div className="col-lg-6">
              <ProductImagesSection />
            </div>

            <div className="col-lg-6">
              <ProductInfoSection />
            </div>
          </div>

          <RelatedProductsSection />

          <DescriptionSection />

          <div className="mt-5 p-4 bg-white rounded">
            <h5>Reviews ({comments.length})</h5>

            {userRedux.user !== undefined && userRedux.user !== null ? (
              <div className="row" style={{ padding: "30px" }}>
                <div className="col-md-6">
                  {comments && comments.length > 0 && (
                    <CommentList comments={currentComments} />
                  )}
                  <Pagination
                    totalProducts={comments.length}
                    productsPerPage={productsPerPage}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                  />
                </div>
                <div className="col-md-6">
                  <h4 className="mb-4">Leave a review</h4>
                  <div>
                    <div className="form-group">
                      <label htmlFor="name">Your Name :</label>{" "}
                      <b>{userRedux.user.user_fullname}</b>
                    </div>
                    <div className="d-flex form-group">
                      <p className="mb-0 mr-2">Your Rating * :</p>
                      <div className="text-primary">
                        {[...Array(5)].map((star, index) => {
                          index += 1;
                          return (
                            <i
                              key={index}
                              className={`${
                                index <= rating ? "fas" : "far"
                              } fa-star`}
                              onClick={() => setRating(index)}
                              onDoubleClick={() => {
                                setRating(0);
                              }}
                            ></i>
                          );
                        })}
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Your Review *</label>
                      <textarea
                        id="message"
                        cols="30"
                        rows="5"
                        className="form-control"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="form-group mb-0">
                      <button
                        className="btn btn-info px-3"
                        onClick={() => onCreateCommentHandler()}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row" style={{ padding: "20px" }}>
                <div className="col-md-12">
                  {comments && comments.length > 0 && (
                    <CommentList comments={currentComments} />
                  )}
                  <Pagination
                    totalProducts={comments.length}
                    productsPerPage={productsPerPage}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <h1>Loading</h1>
      )}
    </>
  );
}
