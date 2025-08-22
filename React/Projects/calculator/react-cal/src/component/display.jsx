import style from "./display.module.css";
const Display = ({ dispVal }) => {
  return (
    <>
      <input
        className={style.display}
        type="text"
        value={dispVal}
        placeholder="Enter expression"
        readOnly
      />
    </>
  );
};
export default Display;
