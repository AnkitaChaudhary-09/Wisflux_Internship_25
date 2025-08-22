//functions
function prinAge(){
   console.log(`your age is ${age}`);
    
}

age=20;
prinAge();
// objects
 let product={
   company: 'Mango',
   name: 'cotton T-shirt',
   price:'530',

 };
 console.log(product);
 console.log(product.company);
 console.log(product.price);
 console.log(product.name);
 delete product['company'];// delete 
 console.log(product);
 product.price=600; //update the value
 console.log(product);


let product={
   company: 'Mango',
   name: 'cotton T-shirt',
   price:'530',
    displayPrice:function(){
    console.log(`Price of the product is ${product.price}`)
    }
 };
 product.displayPrice();
 // Autoboxing: Automatic conversion of primitive to objects.
 //Allows properties & methods to be used on primitives.
 // example: Strings have properties and methods like  length,to uppercase,etc. 
 console.log('This is good'.toLowerCase);

//Destructuring
 let product={
   company: 'Mango',
   name: 'cotton T-shirt',
   price:'530',
   }
   let{company,price}=product;
   console.log(price);//530
   console.log(company);//Mango

  //Anonymous  Fuction as value
    let sum=function(a,b){
      return a+b;
   };
   console.log(sum(4,5));
 //Arrow function
 let sum2=(a,b) =>{
  return a+b;
 };
 console.log(sum2(4,5));

 let sqr =num => num*num;
 console.log(sqr(4));
//event listener
let button =document.querySelector('#btn');
button.addEventListener('click', event =>console.log('i am clicked'));
 

