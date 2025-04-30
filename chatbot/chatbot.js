"use strict";
const dialogflow = require("@google-cloud/dialogflow");
const { struct } = require("pb-util");
const config = require("../config/keys");
//const { response, query } = require("express");

const projectID = config.googleProjectID;


const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey
};


/*const sessionClient = new dialogflow.SessionsClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Use .env here
});*/

// credentials are to save the configurations to the server and to not set the credentials to the local machine
const sessionClient = new dialogflow.SessionsClient({projectID: projectID, credentials: credentials}); 

const sessionPath = sessionClient.projectAgentSessionPath(
  config.googleProjectID,
  config.dialogFlowSessionID
);

module.exports = {
  textQuery: async function (text, parameters = {}) {
    let self = module.exports;
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: text,
          // The language used by the client (en-US)
          languageCode: config.dialogFlowSessionLanguageCode,
        },
      },
      queryParams: {
        payload: {
          data: parameters,
        },
      },
    };

    // Send request and log result
    let responses = await sessionClient.detectIntent(request);
    console.log("Detected intent");
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log(`  No intent matched.`);
    }
    responses = await self.handleAction(responses);
    return responses;
  },

  // The EVENT QUERY
  eventQuery: async function (event, parameters = {}) {
    let self = module.exports;
    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          // The query to send to the dialogflow agent
          name: event,
          parameters: struct.encode(parameters),
          // The language used by the client (en-US)
          languageCode: config.dialogFlowSessionLanguageCode,
        },
      },
      queryParams: {
        payload: {
          data: parameters,
        },
      },
    };

    // Send request and log result
    let responses = await sessionClient.detectIntent(request);
    console.log("Detected intent");
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log(`  No intent matched.`);
    }
    responses = await self.handleAction(responses);
    return responses;
  },

  handleAction: function (responses) {
    return responses;
  },
};
