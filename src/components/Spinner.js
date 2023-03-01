export default function Spinner() {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="spinner-border text-info" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
