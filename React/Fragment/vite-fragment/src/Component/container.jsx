import style from './container.module.css';

const Container =(props)=>{ 
  return<div className={style.cont}>{props.children}</div>;
}
export default Container;