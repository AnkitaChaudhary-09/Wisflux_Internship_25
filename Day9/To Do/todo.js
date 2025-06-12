let todoList=[
    { item:'buy a pen', duedate:'12/06/2025'}, 
    {item:'buy a tea pkt ', duedate:'12/06/2025'}
];
display();
function addTodo(){
    let inputElement=document.querySelector('#input');
    let inputdate =document.querySelector('#date');
    let inputValue = inputElement.value;
    let dateValue = inputdate.value;
    //console.log("Input Value:", inputValue);
    todoList.push({item:inputValue, duedate:dateValue});
    inputElement.value='';
    inputdate.value='';
    display();
}

function display(){
    let containerItem =document.querySelector('.container');
    let  newHtml='';
    for(let i=0; i<todoList.length; i++){
        // let item=todoList[i].item;
        // let duedate=todoList[i].duedate;
        let{item,duedate}=todoList[i];
        newHtml+=`
         
        <span>${item }</span>
        <span>${duedate }</span>
        <button onclick="todoList.splice(${i},1); display();" class="dlt-button" >Delete</button>
        
        `;
    }
    containerItem.innerHTML=newHtml;
    
}
