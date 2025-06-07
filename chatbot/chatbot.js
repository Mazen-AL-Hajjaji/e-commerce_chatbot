"use strict";
const dialogflow = require("@google-cloud/dialogflow");
const { struct } = require("pb-util");
const config = require("../config/keys");
const mongoose = require("mongoose");


const projectID = config.googleProjectID;
const sessionID = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey,
};

const sessionClient = new dialogflow.SessionsClient({
  projectID: projectID,
  credentials: credentials,
});

module.exports = {
  textQuery: async function (text, userID, parameters = {}) {
    let self = module.exports;
    let sessionPath = sessionClient.projectAgentSessionPath(
      projectID,
      sessionID + userID
    );
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,

          languageCode: config.dialogFlowSessionLanguageCode,
        },
      },
      queryParams: {
        payload: {
          data: parameters,
        },
      },
    };

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

  eventQuery: async function (event, userID, parameters = {}) {
    let self = module.exports;
    let sessionPath = sessionClient.projectAgentSessionPath(
      projectID,
      sessionID + userID
    );
    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          name: event,
          parameters: struct.encode(parameters),

          languageCode: config.dialogFlowSessionLanguageCode,
        },
      },
      queryParams: {
        payload: {
          data: parameters,
        },
      },
    };

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
