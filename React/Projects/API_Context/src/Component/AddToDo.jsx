function Additem() {
  return (
    <div class="container text-center">
      <div className="row my-row">
        <div class="col-6">
          <input
            type="text"
            class="form-control"
            placeholder="Enter your task here"
          />
        </div>
        <div class="col-4">
          <input type="date" class="form-control" />
        </div>
        <div className="col-2 ">
          <button type="button" class="btn btn-success my-button">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
export default Additem;
