import AppName from "./Component/AppName";
import Additem from "./Component/AddToDo";
import Item from "./Component/ToDoitem";
import "./App.css";
import { useState } from "react";
import WlmMessage from "./Component/WlmMess";

function App() {
//   let itemList=[{
//      task:"Eat Breakfast",
//     date:"19/07/2025",
//   },{
//     task:"Take Bath",
//     date:"19/07/2025",
//   },{
//     task:"Go to Work",
//     date:"22/07/2025",
//   },{
//     task:"Complete Project",  
//     date:"due date",
//   }
// ]

const[todoItems, setTodoItems]=useState([]);
const handleNewItem=(itemName,itemDueDate)=>{

  const newItem=[...todoItems, {
    task: itemName, 
    date: itemDueDate}]
    setTodoItems(newItem);
}

const handleDeleteItem=(todoitemName)=>{
  const updatedItems=todoItems.filter((item)=>item.task !== todoitemName);
  setTodoItems(updatedItems); 
// console.log(`Item Deleted: ${todoitemName}`);

}

  return (
    <center className="todo-cont">
      <AppName />
      <Additem onNewItem ={handleNewItem} />
      {todoItems.length ===0 && <WlmMessage />}
      <Item itemList={todoItems} onDelete={handleDeleteItem} />
    </center>
  );
}

export default App;
