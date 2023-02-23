import React, { useEffect, useState } from "react";
import { getCookie, setCookie } from "../../util/localStorageHandle";
import * as CONSTANTS from "../../util/constants";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { formatdolla, showToast } from "../../util/helper";
import { sendPostRequest } from "../../util/fetchAPI";
import Paypal from "./components/Paypal";
export default function ProcessCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);

  const loadCartData = () => {
    setCart(JSON.parse(getCookie(CONSTANTS.cartCookie)));
  };

  const onPayHandler = async () => {
    let paypalResponse = await sendPostRequest(
            `${CONSTANTS.baseURL}/order/postOrder`,
            location.state.checkoutData
          );
          if (paypalResponse.status == "success") {
            localStorage.removeItem(CONSTANTS.cartCookie);
            props.setUpdateCart(true);
            navigate("/");
            showToast("SUCCESS", "Order successfully!");
            setTimeout(function() {
              window.location.reload(false);
            }, 2000);
          }
  };

  useEffect(() => {
    loadCartData()
    console.log(location.state.checkoutData.totalPayment)
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-12">
            <nav className="breadcrumb bg-light mb-30">
              <a className="breadcrumb-item text-dark" href="#">
                Home
              </a>
              <a className="breadcrumb-item text-dark" href="#">
                Shop
              </a>
              <span className="breadcrumb-item active">Checkout</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-lg-6">
            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Pay with Paypal</span>
            </h5>
            <div className="bg-light p-30 mb-5">
              <div className="bg-light p-30">
                <Paypal
                    totalPrice={location.state.checkoutData.total_price}
                    handleOrder={onPayHandler}
                  />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Order Total</span>
            </h5>
            <div className="bg-light p-30 mb-5">
              <div className="border-bottom">
                <h6 className="mb-3">Products</h6>
                {cart.map((item, index) => (
                  <div className="d-flex justify-content-between" key={index}>
                    <p>{`${item.product_name} x ${item.quantity}`}</p>
                    <p>{formatdolla(item.totalprice, "$")}</p>
                  </div>
                ))}
              </div>
              <div className="border-bottom pt-3 pb-2">
                <div className="d-flex justify-content-between mb-3">
                  <h6>Subtotal</h6>
                  <h6>{formatdolla(location.state.subtotal, "$")}</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6 className="font-weight-medium">Shipping</h6>
                  <h6 className="font-weight-medium">$5</h6>
                </div>
                {location.state.voucher != undefined &&
                  location.state.voucher.status == 3 && (
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="font-weight-medium">{`Voucher ${location.state.voucher.voucher_infor.code_sale}: ${location.state.voucher.voucher_infor.discount}% off sale`}</h6>
                    </div>
                  )}
              </div>
              <div className="pt-2 border-bottom">
                <div className="d-flex justify-content-between mt-2">
                  <h5>Total</h5>
                  <h5>{formatdolla(location.state.checkoutData.total_price, "$")}</h5>
                </div>
              </div>

              <h6 className="mt-3">Payment Address</h6>
             <div className="row">
                <div className="col-md-4 form-group">
                  <label>Full Name</label>
                  <input
                    className="form-control"
                    type="text"
                    value={location.state.checkoutData.fullname}
                    disabled
                  />
                </div>
                <div className="col-md-4 form-group">
                  <label>Phone number</label>
                  <input
                    className="form-control"
                    type="text"
                    value={location.state.checkoutData.phonenumber}
                    disabled
                  />
                </div>
                <div className="col-md-4 form-group">
                  <label>E-mail</label>
                  <input
                    className="form-control"
                    type="text"
                    value={location.state.checkoutData.email}
                    disabled
                  />
                </div>
                <div className="col-md-12 form-group">
                  <label>Address</label>
                  <input
                    className="form-control"
                    type="text"
                    value={location.state.checkoutData.address}
                    disabled
                  />
                </div>

                <div className="col-md-12 form-group">
                  <label>Message</label>
                  <textarea
                    className="form-control"
                    type="text"
                    value={location.state.checkoutData.message}
                    disabled
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
