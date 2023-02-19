import slide1 from "../../../img/banner.png";
import slide2 from "../../../img/banner1.png";
import slide3 from "../../../img/banner2.png";
import offer1 from "../../../img/banner3.png";
import offer2 from "../../../img/banner4.png";

export default function HomeCarousel() {
  return (
    <div className="bg-white p-3">
      <div className="row">
        <div className="col-12 col-lg-12">
          <div
            id="header-carousel"
            className="carousel slide carousel-fade"
            data-ride="carousel"
          >
            <ol className="carousel-indicators">
              <li
                data-target="#header-carousel"
                data-slide-to="0"
                className="active"
              ></li>
              <li data-target="#header-carousel" data-slide-to="1"></li>
              <li data-target="#header-carousel" data-slide-to="2"></li>
            </ol>
            <div className="carousel-inner">
              <div className="carousel-item position-relative active">
                <img
                  className=" w-100"
                  src={slide1}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="carousel-item position-relative">
                <img
                  className=" w-100"
                  src={slide2}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="carousel-item position-relative">
                <img
                  className=" w-100"
                  src={slide3}
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
        <img className="w-100 mt-1 col-12 col-lg-6" src={offer1} alt="ads" />
        <img className="w-100 mt-1 col-12 col-lg-6" src={offer2} alt="ads" />
      </div>
    </div>
  );
}
