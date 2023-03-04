import React, { useEffect, useState } from "react";
import { getCookie } from "../../util/localStorageHandle";
import * as CONSTANTS from "../../util/constants";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { formatdolla, showToast } from "../../util/helper";
export default function Checkout(props) {
  const navigate = useNavigate();
  const userRedux = useSelector((state) => state.user);
  const [cart, setCart] = useState([]);
  const [userInfor, setUserInfor] = useState({
    user_fullname: userRedux.user.user_fullname,
    user_email: userRedux.user.user_email,
    user_phone_number: userRedux.user.user_phone_number,
    user_address: userRedux.user.user_address,
    user_gender: userRedux.user.user_gender,
  });
  const location = useLocation();
  let unCombinedAddress = userInfor.user_address.split(", ", 5);
  const [newAddress, setNewAddress] = useState({
    country: unCombinedAddress[4],
    province: unCombinedAddress[3],
    district: unCombinedAddress[2],
    ward: unCombinedAddress[1],
    specific: unCombinedAddress[0],
  });
  const loadCartData = () => {
    setCart(JSON.parse(getCookie(CONSTANTS.cartCookie)));
  };

  function processCheckout() {
    if (
      userInfor.user_fullname === "" ||
      userInfor.user_email === "" ||
      userInfor.user_phone_number === "" ||
      userInfor.user_gender === "-- Gender --" ||
      newAddress.country === undefined ||
      newAddress.province === undefined ||
      newAddress.district === undefined ||
      newAddress.ward === undefined ||
      newAddress.specific === undefined
    ) {
      showToast("WARNING", "Invalid information!");
    } else {
      let dataProduct = [];
      cart.map((item) => {
        let newProduct = {
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          description: item.characteristics.values,
          hash: item.characteristics.characteristics_hash,
          price: item.price,
        };
        dataProduct.push(newProduct);
      });
      var checkoutData = {
        dataProduct: dataProduct,
        user_id: userRedux.user.user_id,
        fullname: userInfor.user_fullname,
        email: userInfor.user_email,
        phonenumber: userInfor.user_phone_number,
        address: userInfor.user_address,
        total_price: location.state.totalPayment,
        method_payment: 1,
        paymentInfo: null,
        voucher:
          location.state.voucher != undefined
            ? location.state.voucher.voucher_infor
            : null,
      };
      navigate("/process-checkout", {
        state: {
          checkoutData: checkoutData,
          subtotal: location.state.subtotal,
          totalPayment: location.state.totalPayment,
          voucher: location.state.voucherInfor,
        },
      });
    }
  }

  useEffect(() => {
    let combinedAddress = `${newAddress.specific}, ${newAddress.ward}, ${newAddress.district}, ${newAddress.province}, ${newAddress.country}`;
    setUserInfor((current) => ({
      ...current,
      user_address: combinedAddress,
    }));
  }, [newAddress]);

  useEffect(() => {
    loadCartData();
  }, []);

  return (
    <div className="container mt-5 pt-5">
      <div className="row">
        <div className="col-lg-8 bg-white p-4 rounded">
          <h5>Billing Address</h5>
          <div className="row">
            <div className="col-md-6 form-group">
              <label>Full Name</label>
              <input
                className="form-control"
                type="text"
                value={userInfor.user_fullname}
                onChange={(e) =>
                  setUserInfor((current) => ({
                    ...current,
                    user_fullname: e.target.value,
                  }))
                }
              />
            </div>
            <div className="col-md-6 form-group">
              <label>Phone number</label>
              <input
                className="form-control"
                type="text"
                value={userInfor.user_phone_number}
                onChange={(e) =>
                  setUserInfor((current) => ({
                    ...current,
                    user_phone_number: e.target.value,
                  }))
                }
              />
            </div>
            <div className="col-md-6 form-group">
              <label>E-mail</label>
              <input
                className="form-control"
                type="text"
                value={userInfor.user_email}
                onChange={(e) =>
                  setUserInfor((current) => ({
                    ...current,
                    user_email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="col-md-6 form-group">
              <label>Gender</label>
              <select
                className="form-control"
                name="gender"
                onChange={(e) =>
                  setUserInfor((current) => ({
                    ...current,
                    user_gender: e.target.value,
                  }))
                }
                defaultValue={userInfor.user_gender}
              >
                <option>-- Gender --</option>
                <option value={"male"}>Male</option>
                <option value={"female"}>Female</option>
              </select>
            </div>
            <div className="col-md-12 form-group">
              <label>Specific</label>
              <input
                className="form-control"
                type="text"
                value={newAddress.specific}
                onChange={(e) =>
                  setNewAddress((current) => ({
                    ...current,
                    specific: e.target.value,
                  }))
                }
              />
            </div>
            <div className="col-md-6 form-group">
              <label>Ward</label>
              <input
                className="form-control"
                type="text"
                value={newAddress.ward}
                onChange={(e) =>
                  setNewAddress((current) => ({
                    ...current,
                    ward: e.target.value,
                  }))
                }
              />
            </div>
            <div className="col-md-6 form-group">
              <label>District</label>
              <input
                className="form-control"
                type="text"
                value={newAddress.district}
                onChange={(e) =>
                  setNewAddress((current) => ({
                    ...current,
                    district: e.target.value,
                  }))
                }
              />
            </div>
            <div className="col-md-6 form-group">
              <label>Province</label>
              <input
                className="form-control"
                type="text"
                value={newAddress.province}
                onChange={(e) =>
                  setNewAddress((current) => ({
                    ...current,
                    province: e.target.value,
                  }))
                }
              />
            </div>
            <div className="col-md-6 form-group">
              <label>Country</label>
              <input
                className="form-control"
                type="text"
                value={newAddress.country}
                onChange={(e) =>
                  setNewAddress((current) => ({
                    ...current,
                    country: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
        <div className="col-lg-4 p-4 bg-white rounded border-left">
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
          <div className="pt-2">
            <div className="d-flex justify-content-between mt-2">
              <h5>Total</h5>
              <h5>{formatdolla(location.state.totalPayment, "$")}</h5>
            </div>
          </div>

          <button
            onClick={() => processCheckout()}
            className="w-100 btn btn-info rounded py-3"
          >
            Process checkout
          </button>
        </div>
      </div>
    </div>
  );
}
