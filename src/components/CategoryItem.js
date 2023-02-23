import { Link } from "react-router-dom";

export default function CategoryItem({ category }) {
  return (
    <div className="col-4">
      <div className="d-flex justify-content-center align-items-center">
        <Link
          to={category.category_slug}
          state={{ category_id: category.category_id }}
        >
          <img
            style={{ width: "90px", height: "90px", objectFit: "contain" }}
            src={category.category_image}
          />
        </Link>
      </div>
    </div>
  );
}
