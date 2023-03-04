export const cartCookie = "hle_ecommerce_cart";
export const emailCookie = "hle_ecommerce_email";
export const voucherCookie = "hle_ecommerce_voucher";
export const baseURL = "https://nodejs.skabuy.com";

export const orderStatus = [
  { id: 0, data: "Processing" },
  { id: 1, data: "Delivering" },
  { id: 2, data: "Delivered" },
  { id: 3, data: "Cancelled" },
  { id: 4, data: "Refund" },
];

export const productSliderSettings = {
  arrows: false,
  dots: true,
  infinite: true,
  speed: 500,
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
