import React, { useEffect, useState } from "react";
import { deleteProduct } from "../../redux/actions/buyProduct";
import { getCookie, setCookie } from "../../util/localStorageHandle";
import * as CONSTANTS from "../../util/constants";
import { useDispatch } from "react-redux";
import Axios from "axios";
import {
  discountPrice,
  calculateTotalPrice,
  formatdolla,
  getVoucherStatus,
  showToast,
} from "../../util/helper";
import { useNavigate } from "react-router";
export default function Cart(props) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [voucherCode, setVoucherCode] = useState();
  const [voucherInfor, setVoucherInfor] = useState();
  const [applied, setApplied] = useState(false);
  const dispatch = useDispatch();

  const onChangeQuantityHandler = (quantity, productID) => {
    if (quantity > 0) {
      if (quantity <= 0) return;
      var foundIndex = cart.findIndex(
        (element) => element.product_id == productID
      );
      cart[foundIndex].quantity = quantity;
      cart[foundIndex].totalprice =
        cart[foundIndex].quantity * cart[foundIndex].price;
      setCookie(CONSTANTS.cartCookie, JSON.stringify(cart));
      loadCartData();
      loadTotalPayment();
    }
  };

  const onDeleteFromCartHandler = (removeProduct) => {
    dispatch(deleteProduct(removeProduct));
    window.location.reload(false);
  };

  const onApplyVoucherHandler = async () => {
    if (applied) {
      showToast("WARNING", "You have used one voucher");
    } else {
      await Axios({
        method: "get",
        url: `${CONSTANTS.baseURL}/voucher/getVoucherByCode/${voucherCode}`,
      }).then((result) => {
        const dataResponse = result.data;
        setVoucherInfor(dataResponse);
        if (dataResponse.status == 3) {
          setTotalPayment(
            discountPrice(subtotal, dataResponse.voucher_infor.discount)
          );
          setApplied(true);
        } else {
          showToast("WARNING", getVoucherStatus(dataResponse.status));
        }
      });
    }
  };

  const onCancelApplyVoucher = () => {
    setTotalPayment(subtotal);
    setApplied(false);
  };
  const onCheckoutHandler = () => {
    console.log("checkout");
    navigate("/checkout", {
      state: {
        subtotal: subtotal,
        totalPayment: totalPayment,
        voucher: voucherInfor,
      },
    });
  };

  const loadCartData = () => {
    setCart(JSON.parse(getCookie(CONSTANTS.cartCookie)));
  };

  const loadTotalPayment = () => {
    setSubtotal(calculateTotalPrice(cart));
  };

  useEffect(() => {
    setTotalPayment(subtotal);
  }, [subtotal]);

  useEffect(() => {
    loadCartData();
    loadTotalPayment();
    props.setUpdateCart(true);
  }, []);

  function CartSummarySection() {
    return (
      <div className="p-4 bg-white shadow rounded">
        <h5>Cart Summary</h5>
        <div className="border-bottom pb-2">
          <div className="d-flex justify-content-between mb-3">
            <h6>Subtotal</h6>
            <h6>{formatdolla(subtotal, "$")}</h6>
          </div>
          <div className="d-flex justify-content-between pb-2">
            <h6 className="font-weight-medium">Shipping</h6>
            <h6 className="font-weight-medium">0$</h6>
          </div>
          {applied && (
            <div className="d-flex justify-content-between align-items-center pb-2">
              <h6 className="font-weight-medium">{`Voucher ${voucherInfor.voucher_infor.code_sale}: ${voucherInfor.voucher_infor.discount}% off sale`}</h6>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onCancelApplyVoucher()}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          )}
        </div>
        <div className="pt-2">
          <div className="d-flex justify-content-between mt-2">
            <h5>Total</h5>
            <h5>
              {cart != undefined ? formatdolla(totalPayment, "$") : "$0.00"}
            </h5>
          </div>
          {cart != undefined && (
            <button
              className="btn btn-block btn-info font-weight-bold my-3 py-3 rounded"
              onClick={() => onCheckoutHandler()}
            >
              Proceed To Checkout
            </button>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="container pt-5 mt-5">
      <div className="row">
        <div className="col-lg-8 table-responsive">
          <table className="table table-light table-borderless table-hover text-center mb-0">
            <thead className="thead-dark">
              <tr>
                <th colSpan={2}>Products</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {cart != undefined ? (
                cart.map((val, key) => (
                  <tr key={key}>
                    <td>
                      <form>
                        <img
                          src={val.product_image}
                          alt=""
                          style={{ width: "100px" }}
                        />
                      </form>
                    </td>
                    <td className="align-middle">{val.product_name}</td>
                    <td className="align-middle">
                      {val.characteristics.values}
                    </td>
                    <td className="align-middle">
                      {formatdolla(val.price, "$")}
                    </td>
                    <td className="align-middle">
                      <div
                        className="input-group quantity mx-auto"
                        style={{ width: "100px" }}
                      >
                        <div className="input-group-btn">
                          <button
                            className="btn btn-sm btn-info btn-minus rounded"
                            onClick={() =>
                              onChangeQuantityHandler(
                                val.quantity - 1,
                                val.product_id
                              )
                            }
                          >
                            <i className="fa fa-minus"></i>
                          </button>
                        </div>
                        {val.quantity === undefined ? (
                          <input
                            type="text"
                            className="form-control form-control-sm bg-secondary border-0 text-center"
                            value="1"
                          />
                        ) : (
                          <input
                            type="text"
                            className="form-control form-control-sm bg-secondary border-0 text-center"
                            onChange={(e) =>
                              onChangeQuantityHandler(
                                e.target.value,
                                val.product_id
                              )
                            }
                            value={val.quantity}
                          />
                        )}

                        <div className="input-group-btn">
                          <button
                            className="btn btn-sm btn-info btn-plus rounded"
                            onClick={() => {
                              !(val.quantity >= val.characteristics.total) &&
                                onChangeQuantityHandler(
                                  val.quantity + 1,
                                  val.product_id
                                );
                            }}
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle">
                      {formatdolla(val.totalprice, "$")}
                    </td>
                    <td className="align-middle">
                      <button
                        className="btn btn-sm btn-danger rounded"
                        onClick={() => onDeleteFromCartHandler(val)}
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>Your cart is empty</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="col-lg-4">
          {cart != undefined && (
            <div className="mb-30">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control border-0 p-4"
                  placeholder="Voucher Code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-info"
                    onClick={() => onApplyVoucherHandler()}
                  >
                    Apply Voucher
                  </button>
                </div>
              </div>
            </div>
          )}
          <CartSummarySection />
        </div>
      </div>
    </div>
  );
}
