'use strict';

const Firestore = require('@google-cloud/firestore');
const projectid = 'pp-cxp2';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = new Firestore({
  projectId: projectid,
  timestampsInSnapshots: true
});

//gets transactions of a user
exports.activities = functions.https.onRequest((req, res) => {
    const userId = req.query.userId;
   
    firestore.collection('/users').doc(userId).get()
        .then(doc => {
            if(doc) {
                var transactions = [];
                
                doc.transactions.forEach(txn => {
                    transactions.push(txn.id);
                })
                return res.status(200).send(doc.transactions);
            } else {
                return res.status(200).send({});
            }
        }).catch(err => {
            console.error(err);
            return res.status(404).send({
                error: 'User does not exist. '.concat(userId),
                err
            });    
        })
});

//perform a send money transaction. It involves creating debit leg on the sender side and credit leg on the receiver side. The database that is updated is transactions.
exports.sendmoney = functions.https.onRequest((req, res) => {
  const data = req.body;    
  const current_timestamp = Date.now();
  
  firestore.collection('/transactions').add({
    payee: data.payee,
    payer: data.payer,
    amountInCents: data.amountInCents,
    time_created: current_timestamp,
  });
    
    
    //Add the transaction to the sender side and the receiver side transactions
   // firestore.collection('/users').doc(data.payee.id).then(doc => {
        //if(doc && doc.exists) {
           // doc.
        //}
    //})
    //  senderRef.collection('transactions').add({id: transactionKey});
//  receiverRef.collection('transactions').add({id: transactionKey});
    
var response = {
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