'use strict';

const Firestore = require('@google-cloud/firestore');
const projectid = 'pp-cxp2';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = new Firestore({
  projectId: projectid,
  timestampsInSnapshots: true
});

//perform a send money transaction. It involves creating debit leg on the sender side and credit leg on the receiver side. The database that is updated is transactions.
exports.sendmoney = functions.https.onRequest((req, res) => {
  const data = req.body;
    
    //Expect sender_id, receiver_id, amount_currency, amount_value, sender_notes and image_url
  
//  const senderRef = functions.database.ref('/users/' + req.sender_id);
//  const receiverRef = functions.database.ref('/users/' + req.receiver_id);
  const current_timestamp = Date.now();
  
    // .add() will automatically assign an id
firestore.collection('/transactions').add({
    payee: data.payee,
    payer: data.payer,
    amountInCents: data.amountInCents,
    time_created: current_timestamp,
  });
  
//  //Add the transaction to the sender side and the receiver side transactions
//  senderRef.collection('transactions').add({id: transactionKey});
//  receiverRef.collection('transactions').add({id: transactionKey});
    
var response = {
  "transaction_id": transactionDoc.id,
  "message": "Successfully sent money!"
};
  
 res.status(200).send(response);
});

//Simple hello world function to test https
exports.hello = functions.https.onRequest((req, res) => {
  const current_timestamp = Date.now();
  
  var message = "Hello Firebase! The current timestamp is ".concat(current_timestamp);
  
  res.status(200).send({text: message});
});