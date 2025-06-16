let bagItem ;
onLoad();

function onLoad(){
   let  bagItemStr=localStorage.getItem('bagItem');
   bagItem=bagItemStr ? JSON.parse(bagItemStr): [];
displayItem();
displayBagIcon();
}


function addToBag(itemId){
bagItem.push(itemId);
localStorage.setItem('bagItem',JSON.stringify(bagItem));
displayBagIcon();
}

function displayBagIcon(){
let bagItemCountElement=document.querySelector('.count');
if(bagItem.length>0){
bagItemCountElement.innerText=bagItem.length;
bagItemCountElement.style.visibility='visible';
}else{
    bagItemCountElement.style.visibility='hidden';
    
}

}



function displayItem(){

let itemsContainer=document.querySelector('.main-container');

// let item={
//     item_imag:'images/1.jpg',
//     rating:{
//     stars:4.5,
//     noOfReview:1400,
//     },
//     company_name:'Carlton london',
//     item_name:'Women Steel Straps Watch',
//     current_price:'3240',
//     original_price:'5400',
//     dicount:'40',
// }

if(!itemsContainer){
    return;
}


let  innerHTML='';
items.forEach(item => {
    
    innerHTML+=`
    <div class="item-container">
        <img src="${item.image}" alt="img" class="img">
        <div class="rating">${item.rating.stars}⭐ |${item.rating.count} 
        </div>
        <div class="company">${item.company}</div>
        <div class="item-name">${item.item_name}</div>
        <div class="price"> 
        <span class="current-price">Rs. ${item.current_price}</span>
        <span class="original-price">Rs. ${item.original_price}</span>
        <span class="discount">(${item.discount_percentage}% off)</span>
    </div>
    <button class="bag-button" onclick="addToBag(${item.id})"> Add to Bag</button>

        </div>
        `
});

itemsContainer.innerHTML=innerHTML;
}