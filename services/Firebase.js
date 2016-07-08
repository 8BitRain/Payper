export function createAccount(data) {

  var url = "https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/user/create";

  console.log('Sending POST request to ' + url);
  console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');

  fetch(url, {method: "POST", body: JSON.stringify(data)})
  .then((response) => response.json())
  .then((responseData) => {
    console.log("POST response");
    console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');
    console.log(responseData);
  })
  .done();

}

export function getUsers() {
  var usersRef = new Firebase("https://brady.firebaseio.com/users");
  usersRef.once("value", async function(snapshot) {
    return snapshot.val();
  }, function (error) {
    console.log("The Firebase read failed: " + error.code);
  });
}
