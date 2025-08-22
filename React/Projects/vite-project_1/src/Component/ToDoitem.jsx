import ItemsContent from "./ItemCon";
import styles from './ToDoitem.module.css';
const Item = ({itemList,onDelete}) => {
  return (
    <div className={styles.itemContainer}>
      {itemList.map((item, index) => (
        <ItemsContent key={index} task={item.task} date={item.date} onDltClick={onDelete} />
      ))}
    </div>
  );
}
export default Item;