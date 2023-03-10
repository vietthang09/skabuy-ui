import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { divPriceToArray, showToast } from "../../util/helper";
import { sendGetRequest } from "../../util/fetchAPI";
import { baseURL } from "../../util/constants";
import ProductItem from "../../components/ProductItem";
var lastProductIndex;
var firstProductIndex;
var currentProducts;
export default function ProductByCategory() {
  const location = useLocation();
  const [productList, setProductList] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState({
    category_id: location.state.id,
    attributes: {},
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(16);

  async function loadProducts() {
    const response = await sendGetRequest(
      `${baseURL}/shop/getProductsByCategoryID/${location.state.id}`
    );
    if (response.status == "error") {
      showToast("ERROR", response.message);
    } else {
      setProductList(response.data);
    }
  }

  async function loadAttributes() {
    const response = await sendGetRequest(
      `${baseURL}/shop/getAttributeByCategoryID/${location.state.id}`
    );
    if (response.status == "error") {
      showToast("ERROR", response.message);
    } else {
      setAttributes(response.data);
    }
  }

  async function onSelectAttributeHandler(
    attributeID,
    attributeType,
    attributeValue
  ) {
    var attributes = selectedAttribute.attributes;
    const foundAttribute = Object.keys(attributes).find(
      (el) => el == attributeType
    );

    if (foundAttribute) {
      var foundValue = attributes[foundAttribute].data.find(
        (el) =>
          Object.entries(el).toString() ==
          Object.entries(attributeValue).toString()
      );
      if (foundValue) {
        const foundIndex = attributes[foundAttribute].data.indexOf(foundValue);
        if (foundIndex != -1) {
          attributes[foundAttribute].data.splice(foundIndex, 1);
        }
      } else {
        attributes[foundAttribute].data.push(attributeValue);
      }
    } else {
      attributes[attributeType] = {
        id: attributeID,
        data: [attributeValue],
      };
    }

    const encoded = btoa(JSON.stringify(selectedAttribute));
    const response = await sendGetRequest(
      `${baseURL}/shop/getProductsWithFilter/${encoded}`
    );
    if (response.status == "error") {
      showToast("ERROR", response.message);
    } else {
      setProductList(response.data);
    }
  }
  useEffect(() => {
    loadProducts();
    loadAttributes();
    setSelectedAttribute({
      category_id: location.state.id,
      attributes: {},
    });
  }, [location]);

  lastProductIndex = currentPage * productsPerPage;
  firstProductIndex = lastProductIndex - productsPerPage;
  currentProducts = productList.slice(firstProductIndex, lastProductIndex);

  function FilterSection() {
    return (
      <>
        <div className="p-4 bg-white shadow rounded">
          <h5>Filter by price</h5>
          {attributes.max_price &&
            divPriceToArray(attributes.max_price).map((item, index) => {
              return (
                <div
                  className="custom-control custom-checkbox d-flex align-items-center justify-content-between mt-3"
                  key={index}
                >
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={`price-${index}`}
                    onChange={() =>
                      onSelectAttributeHandler("price", "price", item.data)
                    }
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

        <div className="border-top p-4 bg-white shadow rounded">
          <h5>Filter by trademark</h5>
          {attributes.trademarks &&
            attributes.trademarks.map((item, index) => {
              return (
                <div
                  className="custom-control custom-checkbox d-flex align-items-center justify-content-between mt-3"
                  key={index}
                >
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={`trademark-${index}`}
                    onChange={() => {
                      onSelectAttributeHandler("trademark", "trademark", item);
                    }}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={`trademark-${index}`}
                  >
                    {item}
                  </label>
                </div>
              );
            })}
        </div>

        {attributes.attributes &&
          attributes.attributes.map((item, index) => {
            return (
              <div
                className="border-top p-4 bg-white shadow rounded"
                key={index}
              >
                <h5>{`Filter by ${Object.keys(item)[0]}`}</h5>
                {item[Object.keys(item)[0]].data.map((attItem, attIndex) => {
                  return (
                    <div
                      className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3"
                      key={attIndex}
                    >
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id={`${Object.keys(item)[0]}-${attIndex}`}
                        onChange={() => {
                          onSelectAttributeHandler(
                            item[Object.keys(item)[0]].id,
                            Object.keys(item)[0],
                            attItem
                          );
                        }}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor={`${Object.keys(item)[0]}-${attIndex}`}
                      >
                        {`${attItem} ${item[Object.keys(item)[0]].unit}`}
                      </label>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </>
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
    <div className="container pt-5">
      <button
        type="button"
        className="btn btn-white text-info border rounded mt-2 d-lg-none"
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
