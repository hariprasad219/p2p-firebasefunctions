'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./helloworld-eca5d-firebase-adminsdk-31zno-b6afd7b432.json");

admin.initializeApp({
    projectId: 'helloworld-eca5d',
    credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://helloworld-eca5d.firebaseio.com"
});

//perform a send money transaction. It involves creating debit leg on the sender side and credit leg on the receiver side. The database that is updated is transactions.
exports.sendmoney = functions.https.onRequest(async (req, res) => {
  //Expect sender_id, receiver_id, amount_currency, amount_value, sender_notes and image_url
  
//  const senderRef = functions.database.ref('/users/' + req.sender_id);
//  const receiverRef = functions.database.ref('/users/' + req.receiver_id);
  const current_timestamp = Date.now();
  
  const snapshot = await  admin.database().ref('/transactions').push({
    payee: req.body.payee,
    payer: req.body.payer,
    amountInCents: req.body.amountInCents,
    time_created: current_timestamp,
  });
  
//  //Add the transaction to the sender side and the receiver side transactions
//  senderRef.collection('transactions').add({id: transactionKey});
//  receiverRef.collection('transactions').add({id: transactionKey});
  
 // res.status(200).send("Successfully sent money!");
 res.redirect(303, snapshot.ref.toString())
});

//Simple hello world function to test https
exports.hello = functions.https.onRequest((req, res) => {
  const current_timestamp = Date.now();
  
  var message = "Hello Firebase! The current timestamp is ".concat(current_timestamp);
  
  res.status(200).send({text: message});
});