// Arithmetic Operators
let a = 160;
let b = 360;

console.log("Addition:", a + b);          
console.log("Subtraction:", a - b);       
console.log("Multiplication:", a * b);    
console.log("Division:", a / b);          
console.log("Modulus:", a % b);           
console.log("Exponentiation:", a ** b);   

// Assignment Operators
let x = 15;
x += 3;  
console.log("Assignment (+=):", x);      

// Comparison Operators
console.log("Equal:", a == b);            // false
console.log("Strict Equal:", a === b);    // false
console.log("Not Equal:", a != b);        // true
console.log("Greater Than:", a > b);      // false
console.log("Less Than or Equal:", a <= b); // true

// String Concatenation Operator
let firstName = "Ankita";
let lastName = "Chaudhary";
console.log("Full Name:", firstName + " " + lastName); 

//logical operators
let age=45

//AND operator
//check for both condition
if(age>18 && age<65){
    console.log("You can drive");
}else{
    console.log("use a Bicycle");
}

//OR operator
//check for one condition
let age1= 12;
if(age1<18 || age1>65){
    console.log("You can use a Bicycle");
}else{
    console.log("You can Drive");
}
//Not operator
console.log(!true);
console.log(!false);