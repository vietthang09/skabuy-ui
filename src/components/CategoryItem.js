import { Link } from "react-router-dom";

export default function CategoryItem({ category }) {
  return (
    <div className="col-4 col-lg-2">
      <div className="d-flex justify-content-center align-items-center">
        <Link
          to={category.category_slug}
          state={{ category_id: category.category_id }}
        >
          <img
            style={{ width: "90px", height: "90px", objectFit: "contain" }}
            src={category.category_image}
          />
          <p
            className="d-block text-center font-weight-bold"
            style={{ color: "#424242" }}
          >
            {category.category_name}
          </p>
        </Link>
      </div>
    </div>
  );
}
