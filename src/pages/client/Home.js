import React, { useEffect, useState } from "react";
import { showToast } from "../../util/helper";
import { sendGetRequest } from "../../util/fetchAPI";
import { baseURL } from "../../util/constants";
import HomeCarousel from "./components/HomeCarousel";
import ProductItem from "../../components/ProductItem";
import Slider from "react-slick";
import CategoryItem from "../../components/CategoryItem";
import Spinner from "../../components/Spinner";
const sliderSettings = {
  dots: true,
  centerPadding: "10px",
  infinite: true,
  speed: 500,
  arrows: false,
  slidesToShow: 6,
  slidesToScroll: 6,
  responsive: [
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
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
      <div className="pt-3 pb-4 my-2 bg-white">
        <h4 className="text-center font-weight-bold">Categories.</h4>
        {categories.length > 0 ? (
          <div className="row">
            {categories.map((category, index) => {
              return <CategoryItem category={category} key={index} />;
            })}
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }

  function LastestProductsSection() {
    return (
      <div className="pt-3 pb-4 my-2 bg-white">
        <h5 className="pl-3">Lasted products</h5>
        {lastedProduct.length > 0 ? (
          <Slider {...sliderSettings}>
            {lastedProduct.map((product, index) => {
              return <ProductItem product={product} key={index} />;
            })}
          </Slider>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }

  function PromotionalProductsSection() {
    return (
      <div className="pt-3 pb-4 my-2 bg-white">
        <h5 className="pl-3">Promotional products</h5>
        {promotionalProducts.length > 0 ? (
          <Slider {...sliderSettings}>
            {promotionalProducts.map((product, index) => {
              return <ProductItem product={product} key={index} />;
            })}
          </Slider>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }

  return (
    <div className="container bg-white">
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
