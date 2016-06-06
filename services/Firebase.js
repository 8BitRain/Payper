import Firebase from 'firebase'
let db = new Firebase( "https://coincastdb.firebaseio.com/");

export function createAccount(data){
    var password = data.password,
        email = data.email;

    db.createUser({
     'email': email,
     'password': password
   }, (error, userData) => {

     if(error){
       switch(error.code){

         case "EMAIL_TAKEN":
           alert("The new user account cannot be created because the email is already in use.");
         break;

         case "INVALID_EMAIL":
           alert("The specified email is not a valid email.");
         break;

         default:
           alert("Error creating user:");
       }

     }else{
       alert('Your account was created!');
     }
}
}
