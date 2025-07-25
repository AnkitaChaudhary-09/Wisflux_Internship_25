import styles from './foodInput.module.css';
const FoodInput=()=>{
  const handleChange = (event) => {
    console.log(event.target.value);
  };
return <input type='text' placeholder='Enter Food Item here' className={styles.FoodInput}
onChange={handleChange}/>

}
export default FoodInput;