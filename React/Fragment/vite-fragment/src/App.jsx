import Fooditems from "./Component/Fooditems";
import Errormsg from "./Component/errorMsg";
import "./App.css";
import Container from "./Component/container";
import FoodInput from "./Component/foodInput";
import { useState } from "react";

function App() {
  // let name = [
  //   "chole chawal",
  //   "rajma Chawal",
  //   "idli sambar",
  //   "dosa",
  //   "chole bhature",
  // ];

  let [textShow,setTextState]=useState();
 let [name, setName] =useState(["aloo paratha",  "papad",  "chole bhature", "rajma chawal", "idli sambar", "dosa", "chole chawal", "paneer tikka", "pasta", "pizza", "spring rolls", "samosa","noodles"]);

  
  const handleChange = (event) => {
    if (event.key == "Enter") {
     let newFoodItem = event.target.value;
     event.target.value = "";
     let newItem =[...name, newFoodItem];
      setName(newItem);
    //  console.log('New Food added is:'+newFoodItem);
    }
  };

  


  return (
    <>
      <Container>
        <h1 className="Heading">Healthy Food</h1>
        <Errormsg list={name} />
        <FoodInput handleChange={handleChange} />
        {/* <p>{textShow}</p> */}
        <Fooditems list={name} />  
      </Container>
      <Container>
        <p>
          list of Healthy Food items.
          <br />
          Food is not just about eating energy. It's an experience. Food is
          essential for life, but good food is fuel for the soul.
        </p>
      </Container>
    </>
  );
}

export default App;
