import * as functions from "firebase-functions";

// Simple HTTP function
export const helloWorld = functions.https.onRequest((request, response) => {
  console.log("Hello World function was called!");
  response.send("Hello from Firebase Cloud Functions!");
});
