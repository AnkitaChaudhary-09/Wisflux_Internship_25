import style from './Fooditems.module.css';

const Fooditems = ({ list }) => {
  const handleClick = (item) => {
    console.log(`${item}: proceed to Buy`);};

  return (
    <ul className="list-group">
      {list.map((item) => (
        <li key={item} className={` ${style.myItems}`}>
          {item}
          <button className={style.btn} onClick={()=>handleClick(item)}>Add to Cart</button>
        </li>
      ))}
    </ul>
  );
};

export default Fooditems;
