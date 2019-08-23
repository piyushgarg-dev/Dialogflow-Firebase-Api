// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
var unirest = require('unirest');


var username,useremail,blogtitle,blogbody='hello_test';


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
    console.clear();
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  const getUserName = (agent) =>{
  	username = agent.parameters['given-name'];
    console.log('Name Set to: ',username);
  }
  const getUserEmail = (agent) =>{
  	useremail= agent.parameters['email'];
    console.log('Email Set to: ',useremail);
  }
  const getBlogTitle = (agent) =>{
  	blogtitle = agent.parameters['given-name'];
    console.log('Title Set to: ',blogtitle);
  }
  const getBlogBody = (agent) =>{
  	blogbody =  agent.parameters['given-name'];
    console.log('Body Set to: ',blogbody);
    const apiurl = `http://randomblogs.herokuapp.com/api/3a6b9c12d`;
    const data = {
    email:useremail,
    title:blogtitle,
     body:blogbody
    };
    const options = {
    method:'POST',
      headers:{
      	'Content-Type':'application/json'
      },
      body:JSON.stringify(data)
    };
    
    unirest.post(apiurl)
		.headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
		.send(data)
		.end(function (response) {
  console.log(response.body);
});
  }
  const deployToServer = () =>{
  
  }

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('get user name',getUserName);
  intentMap.set('get user email',getUserEmail);
  intentMap.set('get blog title',getBlogTitle);
  intentMap.set('get blog body',getBlogBody);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
