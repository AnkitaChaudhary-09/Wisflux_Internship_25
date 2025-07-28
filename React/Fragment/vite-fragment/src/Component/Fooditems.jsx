import { useState } from 'react';
import style from './Fooditems.module.css';

const Fooditems = ({ list }) => {
  const [activeItems, setActiveItems] = useState([]);

  const handleClick = (item) => {
    console.log(`${item} being bought`);
  };

  const handleBuy = (item) => {
    if (!activeItems.includes(item)) {
      setActiveItems([...activeItems, item]);
    }
    handleClick(item);
  };

  return (
    <ul className="list-group">
      {list.map((item) => {
        const isBought = activeItems.includes(item);
        return (
          <li key={item} className={`list-group-item ${style.myItems} ${isBought ? 'active' : ''}`}>
            {item}
            <button className={style.btn} onClick={() => handleBuy(item)}>Add to Cart</button>
          </li>
        );
      })}
    </ul>
  );
};

export default Fooditems;
