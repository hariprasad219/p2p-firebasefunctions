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
    console.log("Inside activities function");
    var transactionIds = []; 
    var transactionRefs = [];
    var transactionDetails = [];
    
    firestore.collection('users').doc(userId).collection('transactions').get()
        .then(function(querySnapshot) {                
            console.log('************** Start 1 ***************');
            console.log('Printing User Transaction ids');
            querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());
                transactionIds.push(doc.id);
                transactionRefs.push(firestore.collection('transactions').doc(doc.id));
            });
            console.log('************** End 1 ***************');
            return transactionRefs;
        })
        .then(function(transactionRefs) {
             console.log('************** Start 2 ***************');
             firestore.getAll(transactionRefs[0])
                .then(function(querySnapshot) {
                    console.log('Printing Transaction QueryResults');
                    querySnapshot.forEach(function(doc) {
                    transactionDetails.push(doc.data());
                    
                    console.log("transactionIds" + JSON.stringify(transactionIds));
                    console.log("transactionRefs" + JSON.stringify(transactionRefs));    
                    console.log(JSON.stringify(transactionDetails))
                    return res.status(200).send({results: transactionDetails});
                });  
            }); 
        })
        .catch(err => {
            console.error(err);
            return res.status(404).send({
                error: 'User does not exist. '.concat(userId),
                err
            });    
        })
});

//            firestore.getAll(transactionRefs[0]).then(querySnapshot => {
//                console.log("Result size" + querySnapshot.size);
//                transactionDetails = querySnapshot.docs.map(doc => doc.data());
//            });

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