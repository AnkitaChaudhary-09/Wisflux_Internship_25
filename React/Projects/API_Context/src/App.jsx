import AppName from "./Component/AppName";
import Additem from "./Component/AddToDo";
import Item1 from "./Component/ToDoitem1";
import Item2 from "./Component/ToDoitem2";
import "./App.css";
function App() {
  return (
    <center className="todo-cont">
      <AppName />
      <Additem />
      <div className="item-container">
      <Item1 />
      <Item2 />
      </div>
    </center>
  );
}

export default App;
