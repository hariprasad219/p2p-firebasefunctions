'use strict';

const Firestore = require('@google-cloud/firestore');
const projectid = 'pp-cxp2';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = new Firestore({
  projectId: projectid
});

//gets transactions of a user
exports.activities = functions.https.onRequest((req, res) => {
    const userId = req.query.userId;
    
    firestore.collection('users').doc(userId).collection('transactions').get()
        .then(function(querySnapshot) {                
            var transactionRefs = [];
            querySnapshot.forEach(function(doc) {
                transactionRefs.push(firestore.collection('transactions').doc(doc.id));
            });
            return transactionRefs;
        })
        .then(function(transactionRefs) {
            var transactionDetails = []; 
            if(transactionRefs.length != 0) {
                firestore.getAll(...transactionRefs)
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            transactionDetails.push({
                                 id: doc.id, 
                                 payer: doc.data().payer,
                                 amountInCents: doc.data().amountInCents,
                                 timeCreated: doc.data().timeCreated,
                                 payee: doc.data().payee,
                                 status: doc.data().status
                            }); 
                        });
                        return res.status(200).send({results: transactionDetails});
                    });
            } else {
                return res.status(200).send({results: transactionDetails});
            }
        })
        .catch(err => {
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