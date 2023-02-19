import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { showToast } from "../../util/helper";
import { sendGetRequest } from "../../util/fetchAPI";
import { baseURL } from "../../util/constants";
import offer1 from "../../img/banner3.png";
import HomeCarousel from "./components/HomeCarousel";
import Product from "./components/Product";
import Slider from "react-slick";

export default function Home() {
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
    slidesToScroll: 6,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  useEffect(() => {
    loadCategories();
    loadTopProducts();
    loadPromotionalProducts();
  }, []);

  return (
    <div className="container-fluid">
      <HomeCarousel />
      <div className="bg-white p-3 mt-1">
        <h5 className="text-uppercase">Categories</h5>
        <div className="row">
          {categories.map((val, key) => (
            <Link
              className="text-decoration-none col-6 col-lg-4"
              to={val.category_slug}
              state={{ category_id: val.category_id }}
              key={key}
            >
              <div className="d-flex align-items-center">
                <img
                  className="p-2"
                  src={val.category_image}
                  alt=""
                  style={{
                    height: "80px",
                    width: "80px",
                    objectFit: "contain",
                  }}
                />
                <div>
                  <h5>{val.category_name}</h5>
                  <small className="text-body">{val.quantity} Products</small>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white p-3 pb-4 mt-1">
        <h5 className="text-uppercase">Latest product</h5>
        <div className="px-4">
          <Slider {...sliderSettings}>
            {topProduct.map((item) => {
              return <Product product={item} />;
            })}
          </Slider>
        </div>
      </div>

      <div className="bg-white p-3 pb-4 mt-1">
        <h5 className="text-uppercase">Promotional products</h5>
        <div className="px-4">
          <Slider {...sliderSettings}>
            {promotionalProducts.map((item) => {
              return <Product product={item} />;
            })}
          </Slider>
        </div>
      </div>

      <div className="bg-white p-3 pb-4 mt-1">
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="product-offer" style={{ height: "300px" }}>
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
          <div className="col-12 col-lg-6">
            <div className="product-offer" style={{ height: "300px" }}>
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

      <div className="p-3 mt-1">
        <div className="row">
          <div className="col-lg-3 col-6 pb-1 shadow-sm bg-white">
            <div
              className="d-flex align-items-center mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fa fa-check text-primary m-0 mr-3"></h1>
              <h5 className="font-weight-semi-bold m-0">Quality Product</h5>
            </div>
          </div>
          <div className="col-lg-3 col-6 pb-1 shadow-sm bg-white">
            <div
              className="d-flex align-items-center mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fa fa-shipping-fast text-primary m-0 mr-2"></h1>
              <h5 className="font-weight-semi-bold m-0">Free Shipping</h5>
            </div>
          </div>
          <div className="col-lg-3 col-6 shadow-sm bg-white">
            <div
              className="d-flex align-items-center mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fas fa-exchange-alt text-primary m-0 mr-3"></h1>
              <h5 className="font-weight-semi-bold m-0">14-Day Return</h5>
            </div>
          </div>
          <div className="col-lg-3 col-6 shadow-sm bg-white">
            <div
              className="d-flex align-items-center mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fa fa-phone-volume text-primary m-0 mr-3"></h1>
              <h5 className="font-weight-semi-bold m-0">24/7 Support</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
