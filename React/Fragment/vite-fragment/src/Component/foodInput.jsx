import styles from "./foodInput.module.css";
const FoodInput = ({ handleChange }) => {
  return (
    <input
      type="text"
      placeholder="Enter Food Item here"
      className={styles.FoodInput}
      onKeyDown={handleChange}
    />
  );
};
export default FoodInput;
