import style from './buttonContainer.module.css';
const ButtonContainer = ({onButtonClick}) => {
  const list =["C","1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "*", "/", "=","."];
  return <>
  <div className={style.buttonContainer}>
    {list.map((item, index) => 
      <button className={style.button}
      key={index}
      onClick= {()=> onButtonClick(item)}>{item}</button>
    )}
    </div>
  </>
}
export default ButtonContainer;