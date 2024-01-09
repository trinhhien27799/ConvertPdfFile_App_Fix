import admin from 'firebase-admin'

var serviceAccount = require("../my-convert-pdf-file-app-firebase-adminsdk-9gubb-719a4ab271.json");
// Initialize firebase admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})
// Cloud storage
const bucket = admin.storage().bucket()

module.exports = {
    bucket
}