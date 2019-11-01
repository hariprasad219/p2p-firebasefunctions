# Introduction
The file `index.js` has the cloud functions to retrieve activities and contacts of a user. Both the end points also support pagination.


# Steps to deploy firebase functions

## Prerequisites
1. First and foremost you need to have access to the firebase project that has been created for P2P Prototype. 
https://console.firebase.google.com/u/0/project/pp-cxp2/overview
2. set an environmental variable to avoid any authorization issues while uploading the files.

`export NODE_TLS_REJECT_UNAUTHORIZED=0`

## Steps to deploy

###  Install firebase CLI

`npm install -g firebase-tools`
https://firebase.google.com/docs/cli#install_the_firebase_cli

###  Initialize your project. 

To connect your local project to your Firebase project, run the following command from the root of your local project directory:
`firebase init`

### Deploy to cloud

`firebase deploy`

If you want to upload explicit functions you might find the below functions to be helpful.
`firebase deploy --only functions`

`firebase deploy --only functions:contacts,functions:activities`

# Functions

## Postman collection

https://www.getpostman.com/collections/e8e4b9e647d21661542a

## Get Activities

Fetches the activities of the user.

https://us-central1-pp-cxp2.cloudfunctions.net/activities?userId=thierry.granger@gmail.com&pageSize=2&lastRecordTimeCreated=1572639098776

## Get Contacts

Fetches the contacts of the user.

https://us-central1-pp-cxp2.cloudfunctions.net/contacts?userId=thierry.granger@gmail.com&pageSize=1&lastRecordId=debohra.saba@gmail.com

## Send Money to a contact

Simulates a send money transaction between the contacts by updating the transaction entries in the database.

https://us-central1-pp-cxp2.cloudfunctions.net/sendmoney

Sample Request
```json
{
    "payer": {
        "firstName": "Laurent",
        "imageProfileUrl": "https://pics.paypal.com/00/p/YTA2OWQ5ZjMtOTcwMy00MmFmLTliM2UtZTdkYmUwYTVlMzFl/image_3.JPG",
        "id": "laurent.goujon@online.fr",
        "lastName": "Goujon"
    },
    "amountInCents": 22348,
    "payee": {
        "firstName": "Matthew",
        "imageProfileUrl": "https://pics.paypal.com/00/s/MjAwWDIwMA==/z/sj4AAOxyeR9TJTPP/$_2.JPG",
        "id": "medelman0711@gmail.com",
        "lastName": "Edelman"
    },
    "status": 0
}
```

Sample Response
```javascript
{
    "message": "Successfully sent money!",
    "transactionId": "q0EWmuJDXmWlN8ztJObu"
}
```

