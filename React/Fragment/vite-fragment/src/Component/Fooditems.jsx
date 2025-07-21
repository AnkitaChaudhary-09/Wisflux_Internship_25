const Fooditems=({list})=>{
  // let name = ["chole chawal","rajma Chawal","idli sambar","dosa","chole bhature"];
return(
    <ul className="list-group">
    {list.map((item) => (
 
  <li key={item} className="list-group-item">{item}</li>
    ))}
</ul>
);
}
export default Fooditems;