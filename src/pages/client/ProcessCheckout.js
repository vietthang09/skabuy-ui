import React, { useEffect, useState } from "react";
import { getCookie } from "../../util/localStorageHandle";
import * as CONSTANTS from "../../util/constants";
import { useLocation, useNavigate } from "react-router";
import { formatdolla, showToast } from "../../util/helper";
import { sendPostRequest } from "../../util/fetchAPI";
import Paypal from "./components/Paypal";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/CheckoutForm";
const stripePromise = loadStripe(
  "pk_test_51MeKYkFcODX6xQGLdPONtrQ5U6JaloXZRia0pEtnbjaWRTrzK2DPf2SXdazWaVheY4d1eiCwk7cut5kGH9PvV4CA00eRvulQza"
);
export default function ProcessCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [clientSecret, setClientSecret] = useState("");

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

  async function loadStripeIntent() {
    const response = await sendPostRequest(
      `${CONSTANTS.baseURL}/payment/create-payment-intent`,
      { price: location.state.checkoutData.total_price }
    );
    if (response.status == "error") {
      showToast("ERROR", response.message);
    } else {
      setClientSecret(response.data);
    }
  }

  useEffect(() => {
    loadCartData();
    loadStripeIntent();
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row">
        <div className="col-lg-6">
          <div className="bg-white p-4 rounded">
            <h5 className="mt-3">Payment Address</h5>
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
            </div>
            <h5>Order Total</h5>
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
                <h6 className="font-weight-medium">$0</h6>
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
                <h5>
                  {formatdolla(location.state.checkoutData.total_price, "$")}
                </h5>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="p-4 bg-white rouned">
            <h5>Payment</h5>
            <Paypal
              totalPrice={location.state.checkoutData.total_price}
              handleOrder={onPayHandler}
            />

            <h5 className="text-center">OR</h5>
            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
