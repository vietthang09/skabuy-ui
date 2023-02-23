import React, { useEffect, useState } from "react";
import { showToast } from "../../util/helper";
import { sendGetRequest } from "../../util/fetchAPI";
import { baseURL } from "../../util/constants";
import offer1 from "../../img/banner3.png";
import HomeCarousel from "./components/HomeCarousel";
import Product from "./components/Product";
import Slider from "react-slick";
import CategoryItem from "../../components/CategoryItem";
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: false,
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
export default function Home() {
  const [categories, setCategories] = useState([]);
  const [lastedProduct, setLastedProduct] = useState([]);
  const [promotionalProducts, setPromotionalProducts] = useState([]);

  async function loadCategories() {
    const response = await sendGetRequest(`${baseURL}/category/all`);
    if (response.status == "success") {
      setCategories(response.data);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  async function loadLastedProducts() {
    const response = await sendGetRequest(`${baseURL}/product/top`);
    if (response.status == "success") {
      setLastedProduct(response.data);
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

  useEffect(() => {
    loadCategories();
    loadLastedProducts();
    loadPromotionalProducts();
  }, []);

  function CategoriesSection() {
    return (
      <div className="py-3 my-2 bg-white">
        <h4 className="text-center font-weight-bold">Categories.</h4>
        <div className="row">
          {categories.map((category, index) => {
            return <CategoryItem category={category} key={index} />;
          })}
        </div>
      </div>
    );
  }

  function LastestProductsSection() {
    return (
      <div className="py-3 my-2 bg-white">
        <h5 className="pl-3">Lasted products</h5>
        <Slider {...sliderSettings}>
          {lastedProduct.map((product, index) => {
            return <Product product={product} key={index} />;
          })}
        </Slider>
      </div>
    );
  }

  function PromotionalProductsSection() {
    return (
      <div className="py-3 my-2 bg-white">
        <h5 className="pl-3">Promotional products</h5>
        <Slider {...sliderSettings}>
          {promotionalProducts.map((product, index) => {
            return <Product product={product} key={index} />;
          })}
        </Slider>
      </div>
    );
  }

  return (
    <div className="container">
      <HomeCarousel />

      <PromotionalProductsSection />

      <CategoriesSection />

      <img className=" w-100" src="/banners/banner_6.jpg" />

      <LastestProductsSection />
      <PromotionalProductsSection />

      <img className=" w-100" src="/banners/banner_7.jpg" />
      <PromotionalProductsSection />
      <LastestProductsSection />

      <img className=" w-100" src="/banners/banner_8.jpg" />
      <LastestProductsSection />
      <PromotionalProductsSection />

      <img className=" w-100" src="/banners/banner_9.jpg" />
      <PromotionalProductsSection />
      <LastestProductsSection />

      <img className=" w-100" src="/banners/banner_10.jpg" />
    </div>
  );
}
