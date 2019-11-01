'use strict';

const Firestore = require('@google-cloud/firestore');
const functions = require('firebase-functions');

const projectid = 'pp-cxp2';
const firestore = new Firestore({
  projectId: projectid
});

const DEFAULT_PAGE_SIZE=3;

//gets transactions of a user
exports.activities = functions.https.onRequest((req, res) => {
    const userId = req.query.userId;
    var pageSize = parseInt(req.query.pageSize, 10);
    console.log("Page size: " + pageSize + "Type : " + typeof(pageSize));

    if(typeof(pageSize) != "number" || Number.isNaN(pageSize)) {
        pageSize = parseInt(DEFAULT_PAGE_SIZE, 10);
        console.log("Page size is not set in the query params. Updated page size: " + pageSize + "Type : " + typeof(pageSize));
    }
    
    firestore.collection('users').doc(userId)
        .collection('transactions').orderBy('timeCreated', 'desc')
        .limit(pageSize).get()
        .then(function(querySnapshot) {                
            var transactionRefs = [];
            querySnapshot.forEach(function(doc) {
                transactionRefs.push(
                    firestore.collection('transactions').doc(doc.id));
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

//gets contacts of a user
exports.contacts = functions.https.onRequest((req, res) => {
    const userId = req.query.userId;
    var pageSize = parseInt(req.query.pageSize, 10);
    console.log("Page size: " + pageSize + "Type : " + typeof(pageSize));

    if(typeof(pageSize) != "number" || Number.isNaN(pageSize)) {
        pageSize = parseInt(DEFAULT_PAGE_SIZE, 10);
        console.log("Page size is not set in the query params. Updated page size: " + pageSize + "Type : " + typeof(pageSize));
    }
    
    firestore.collection('users').doc(userId)
        .collection('contacts').orderBy('id', 'desc')
        .limit(pageSize).get()
        .then(function(querySnapshot) {                
            var contactRefs = [];
            querySnapshot.forEach(function(doc) {
                contactRefs.push(
                    firestore.collection('users').doc(doc.id));
            });
            return contactRefs;
        })
        .then(function(contactRefs) {
            var contactDetails = []; 
            if(contactRefs.length != 0) {
                firestore.getAll(...contactRefs)
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            var contact = doc.data();
                            contact.id = doc.id;
                            contactDetails.push(contact); 
                        });
                        return res.status(200).send({results: contactDetails});
                    });
            } else {
                return res.status(200).send({results: contactDetails});
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
  
  console.log("current_timestamp : " + current_timestamp);
  firestore.collection('transactions').add({
    payee: data.payee,
    payer: data.payer,
    amountInCents: data.amountInCents,
    timeCreated: current_timestamp,
    status: data.status
  }).then(function(docRef) {
      if(data.payee && data.payee.id) {
          firestore.collection('users').doc(data.payee.id)
              .collection('transactions').doc(docRef.id).set({
              id: docRef.id,
              timeCreated: current_timestamp
          })
      }
      return docRef;
  }).then(function(docRef) {
      if(data.payer && data.payer.id) {
          firestore.collection('users').doc(data.payer.id)
              .collection('transactions').doc(docRef.id).set({
              id: docRef.id,
              timeCreated: current_timestamp
          })
      }
      return docRef;
  }).then(function(docRef) {
    var response = {
      "message": "Successfully sent money!",
      "transactionId": docRef.id
    };
    console.log(response);
    return res.status(200).send(response); 
  }).catch(err => {
        console.error(err);
        return res.status(500).send({
            error: 'Internal server error updating the message',
            err
        });    
    })
});
        

//Simple hello world function to test https
exports.hello = functions.https.onRequest((req, res) => {
  const current_timestamp = Date.now();
  
  var message = "Hello Firebase! The current timestamp is ".concat(current_timestamp);
  
  res.status(200).send({text: message});
});