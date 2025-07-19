function Item1(){
  let Task= "Eat Breakfast";
  let Date= "19/07/2025";
  return <div class="container ">
    <div class="row my-row">
          <div class="col-6">
           {Task}
          </div>
          <div class="col-4">
            {Date}
          </div>
          <div className="col-2">
           <button type="button" class="btn btn-danger my-button">Delete</button>
        </div>
       </div>
  </div>
}
export default Item1;