import Fooditems from './Component/Fooditems';
import Errormsg from './Component/errorMsg';
import './App.css'

function App() {
  let name = ["chole chawal","rajma Chawal","idli sambar","dosa","chole bhature"];
  return<>
    <h1>Healthy Food</h1>
    <Errormsg list={name} />
    <Fooditems  list={name}/>
    </>
}

export default App
