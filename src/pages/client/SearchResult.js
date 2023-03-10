import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import Pagination from "../../components/Pagination";
import { divPriceToArray, showToast } from "../../util/helper";
import { baseURL } from "../../util/constants";
import ProductItem from "../../components/ProductItem";
var lastProductIndex;
var firstProductIndex;
var currentProducts;
var firstTime = true;
export default function SearchResult() {
  const { keyword } = useParams();
  const [productList, setProductList] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(16);
  const loadProductWithKeyword = async () => {
    const data = {
      keyword: keyword,
      price: selectedPrice,
    };
    const encoded = btoa(JSON.stringify(data));
    Axios.get(`${baseURL}/shop/search/${encoded}`).then((response) => {
      const responseData = response.data;
      if (responseData.status == "error") {
        showToast("ERROR", response.message);
      } else {
        setProductList(responseData.data);
        if (firstTime) {
          let maxProduct = responseData.data.reduce((max, el) =>
            max.product_price > el.product_price ? max : el
          );
          setMaxPrice(maxProduct.product_price);
          firstTime = false;
        }
      }
    });
  };

  const onSelectPriceHandler = (newPrice) => {
    const foundIndex = selectedPrice.findIndex(
      (el) =>
        Object.entries(el).toString() == Object.entries(newPrice).toString()
    );

    if (foundIndex != -1) {
      let pricesArr = selectedPrice;
      pricesArr.splice(foundIndex, 1);
      setSelectedPrice(pricesArr);
    } else {
      setSelectedPrice((current) => [...current, newPrice]);
    }
    loadProductWithKeyword();
  };

  useEffect(() => {
    loadProductWithKeyword();
  }, [keyword, selectedPrice]);
  useEffect(() => {
    firstTime = true;
  }, [keyword]);

  lastProductIndex = currentPage * productsPerPage;
  firstProductIndex = lastProductIndex - productsPerPage;
  currentProducts = productList.slice(firstProductIndex, lastProductIndex);

  function FilterSection() {
    return (
      <div className="p-4 bg-white shadow rounded">
        <h5>Filter by price</h5>
        {divPriceToArray(maxPrice).map((item, index) => {
          return (
            <div
              className="custom-control custom-checkbox d-flex align-items-center justify-content-between mt-3"
              key={index}
            >
              <input
                type="checkbox"
                className="custom-control-input"
                id={`price-${index}`}
                onChange={() => onSelectPriceHandler(item.data)}
              />
              <label
                className="custom-control-label"
                htmlFor={`price-${index}`}
              >
                {item.text}
              </label>
            </div>
          );
        })}
      </div>
    );
  }

  function ProductsSection() {
    return (
      <div>
        <div className="row">
          {currentProducts.map((product, index) => (
            <div className="col-4 col-lg-3" key={index}>
              <ProductItem product={product} />
            </div>
          ))}
        </div>
        <Pagination
          totalProducts={productList.length}
          productsPerPage={productsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    );
  }
  return (
    <div className="container pt-5 mt-lg-5 mt-2">
      <span className="mt-2">{`Found ${productList.length} ${
        productList.length > 1 ? "products" : "product"
      } with keyword "${keyword}" `}</span>

      <button
        type="button"
        className="btn btn-white text-info border rounded d-block d-lg-none"
        data-toggle="modal"
        data-target="#filterModel"
      >
        Filter
      </button>

      <div className="row mt-5 d-none d-lg-flex">
        <div className="col-3">
          <FilterSection />
        </div>
        <div className="col-1"></div>
        <div className="col-8">
          <ProductsSection />
        </div>
      </div>

      <div className="d-block d-lg-none">
        <ProductsSection />
      </div>

      <div
        className="modal fade"
        id="filterModel"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Filter
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <FilterSection />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success rounded"
                data-dismiss="modal"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
