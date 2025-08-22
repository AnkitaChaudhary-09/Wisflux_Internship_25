import style from './App.module.css';
import Display from './component/display';
import ButtonContainer from './component/buttonContainer';
import { useState } from 'react';
function App() {

  const [calVal, setCalVal]= useState("");
  const onButtonClick = (buttonText) =>{console.log(buttonText);
    if(buttonText === "C"){
      setCalVal("");
    } else if(buttonText === "="){
      try {
        setCalVal(eval(calVal));
      } catch (error) {
        setCalVal("Error");
      }
    } else {
      setCalVal(calVal + buttonText);
    }
  }

  return <>
  <div className={style.calculator}>
    <h1 className={style.Name}>Calculator</h1>
    <Display dispVal={calVal} />
    <ButtonContainer onButtonClick={onButtonClick} />
  
  </div>

  </>
}

export default App
