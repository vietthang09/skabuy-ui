import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import offer1 from "../../img/banner3.png";
import { showToast } from "../../util/helper";
import { sendGetRequest, sendPostRequest } from "../../util/fetchAPI";
import { baseURL, cartCookie, emailCookie } from "../../util/constants";
import { useSelector } from "react-redux";
import { getCookie } from "../../util/localStorageHandle";
import Products from "./components/Products";
import * as CONSTANTS from "../../util/constants";
import HomeCarousel from "./components/HomeCarousel";
import Product from "./components/Product";
import Slider from "react-slick";

export default function Home() {
  const userRedux = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [topProduct, setTopProduct] = useState([]);
  const [promotionalProducts, setPromotionalProducts] = useState([]);

  async function loadCategories() {
    const response = await sendGetRequest(`${baseURL}/category/all`);
    if (response.status == "success") {
      setCategories(response.data);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  async function loadTopProducts() {
    const response = await sendGetRequest(`${baseURL}/product/top`);
    if (response.status == "success") {
      setTopProduct(response.data);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  async function loadPromotionalProducts() {
    const response = await sendGetRequest(`${baseURL}/product/promotional`);
    if (response.status == "success") {
      setPromotionalProducts(response.data);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6
  }

  useEffect(() => {
    loadCategories();
    loadTopProducts();
    loadPromotionalProducts();
  }, []);

  return (
    <>
      <div className="container-fluid mb-3" style={{paddingTop: "100px"}}>
        <HomeCarousel />
      </div>

      <div className="container-fluid pt-5">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4">
          <span className="bg-secondary pr-3">Categories</span>
        </h2>
        <div className="row px-xl-5 pb-3">
          {categories.map((val, key) => (
            <div className="col-lg-2 col-md-4 col-sm-6 pb-1" key={key}>
              <Link
                className="text-decoration-none"
                to={val.category_slug}
                state={{ category_id: val.category_id }}
              >
                <div className="cat-item d-flex align-items-center mb-4 p-1">
                  <div className="overflow-hidden">
                    <img
                      className="img-fluid"
                      src={val.category_image}
                      alt=""
                      style={{
                        padding: "10px",
                        height: "80px",
                        alignItems: "center",
                      }}
                    />
                  </div>
                  <div className="flex-fill pl-3">
                    <h5>{val.category_name}</h5>
                    <small className="text-body">{val.quantity} Products</small>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="container-fluid pt-5 pb-3">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4">
          <span className="bg-secondary pr-3">Latest product</span>
        </h2>
        <div className="px-xl-5">
          <Slider {...sliderSettings}>  
            {topProduct.map((item) => {
              return <Product product={item} />
            })}
          </Slider>
        </div>
      </div>

      <div className="container-fluid pt-5 pb-3">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4">
          <span className="bg-secondary pr-3">Promotional products</span>
        </h2>
        <div className="px-xl-5">
          <Slider {...sliderSettings}>  
            {promotionalProducts.map((item) => {
              return <Product product={item} />
            })}
          </Slider>
        </div>
      </div>

      <div className="container-fluid pt-5 pb-3">
        <div className="row px-xl-5">
          <div className="col-md-6">
            <div className="product-offer mb-30" style={{ height: "300px" }}>
              <img className="img-fluid" src={offer1} alt="" />
              <div className="offer-text">
                <h6 className="text-white text-uppercase">Save 20%</h6>
                <h3 className="text-white mb-3">Special Offer</h3>
                <a to="" className="btn btn-info">
                  Shop Now
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="product-offer mb-30" style={{ height: "300px" }}>
              <img className="img-fluid" src={offer1} alt="" />
              <div className="offer-text">
                <h6 className="text-white text-uppercase">Save 20%</h6>
                <h3 className="text-white mb-3">Special Offer</h3>
                <a to="" className="btn btn-info">
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid pt-5">
        <div className="row px-xl-5 pb-3">
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center bg-light mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fa fa-check text-primary m-0 mr-3"></h1>
              <h5 className="font-weight-semi-bold m-0">Quality Product</h5>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center bg-light mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fa fa-shipping-fast text-primary m-0 mr-2"></h1>
              <h5 className="font-weight-semi-bold m-0">Free Shipping</h5>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center bg-light mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fas fa-exchange-alt text-primary m-0 mr-3"></h1>
              <h5 className="font-weight-semi-bold m-0">14-Day Return</h5>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center bg-light mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fa fa-phone-volume text-primary m-0 mr-3"></h1>
              <h5 className="font-weight-semi-bold m-0">24/7 Support</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
