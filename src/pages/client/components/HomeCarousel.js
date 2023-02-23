export default function HomeCarousel() {
  return (
    <div className="pt-3">
      <div className="carousel slide" data-ride="carousel">
        <ol className="carousel-indicators">
          <li data-slide-to="0" className="active"></li>
          <li data-slide-to="1"></li>
          <li data-slide-to="2"></li>
          <li data-slide-to="3"></li>
          <li data-slide-to="4"></li>
        </ol>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img className=" w-100" src="/banners/banner_1.jpg" />
          </div>
          <div className="carousel-item">
            <img className=" w-100" src="/banners/banner_2.jpg" />
          </div>
          <div className="carousel-item">
            <img className=" w-100" src="/banners/banner_3.jpg" />
          </div>
          <div className="carousel-item">
            <img className=" w-100" src="/banners/banner_4.jpg" />
          </div>
          <div className="carousel-item">
            <img className=" w-100" src="/banners/banner_5.jpg" />
          </div>
        </div>
      </div>
    </div>
  );
}
