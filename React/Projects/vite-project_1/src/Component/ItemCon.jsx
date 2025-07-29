import { RiDeleteBin6Line } from "react-icons/ri";

function ItemsContent({task, date,onDltClick}) {

  return <div className="container ">
    <div className="row my-row">
          <div className="col-6">
           {task}
          </div>
          <div className="col-4">
            {date}
          </div>
          <div className="col-2">
           <button type="button" className="btn btn-danger my-button" onClick={()=>onDltClick(task)}><RiDeleteBin6Line /></button>
        </div>
       </div>
  </div>
}
export default ItemsContent;