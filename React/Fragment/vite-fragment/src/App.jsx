import Fooditems from "./Component/Fooditems";
import Errormsg from "./Component/errorMsg";
import "./App.css";
import Container from "./Component/container";
import FoodInput from "./Component/foodInput";

function App() {
  let name = [
    "chole chawal",
    "rajma Chawal",
    "idli sambar",
    "dosa",
    "chole bhature",
  ];
  return (
    <>
      <Container>
        <h1 className="Heading">Healthy Food</h1>
        <Errormsg list={name} />
        <FoodInput />
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
