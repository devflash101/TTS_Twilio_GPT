const axios = require('axios');
const { response } = require('express');
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;

const myFunc = (req, res) => {
    const response = new VoiceResponse();

    // Example: Say a message using Twilio's default TTS
    response.say('Hello, this is your TTS response');

    // Respond to Twilio with instructions
    res.type('text/xml');
    res.send(response.toString());
}
/*
    //   just repeating an audio file.
const incomingCall = (req, res) => {
   const response = new VoiceResponse();
   const audioUrl = process.env.MY_URL + '/audio/boop.mp3';
   response.play(audioUrl);
    // Example: Greet the caller with a simple message
 //   response.say('Hello, thank you for calling!');
  
    // You can add more TwiML verbs here as needed
    // For example, to record the call:
    // response.record();
  
    // To gather input from the caller:
    const gather = response.gather({ numDigits: 1 });
    gather.say('Please press 1 to speak to a representative');
  
    const redirecturl = process.env.MY_URL + '/webhook/incoming-call';
    response.redirect(redirecturl);
    // End the call
  //  response.hangup();
  
   res.type('text/xml');
   res.send(response.toString());
};
*/

const incomingCall = (req, res) => {
    const response = new VoiceResponse();
    const audioUrl = process.env.MY_URL + '/audio/generated-audio.wav';
    // response.play(audioUrl);
    console.log('incoming call..');

    const handleinputurl = process.env.MY_URL + '/webhook/handle-input';
    const gather = response.gather({
        input: 'speech',
        timeout: 2,
        action: handleinputurl, // Define another endpoint to process input
        method: 'POST',
    });
    gather.say('Well... please say something.');

    // If no input is received, loop back and play the message again
    const incomingurl = process.env.MY_URL + '/webhook/incoming-call';
    response.redirect(incomingurl);

    res.type('text/xml');
    res.send(response.toString());
};

const getAnswerFromGPT = async (req, res) => {
    console.log('get answer from gpt');
    const openaiApiKey = process.env.YOUR_OPENAI_API_KEY;
    try {
        const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-3.5-turbo", // or any other model you prefer
          messages: [{
            role: "system",
            content: "You are a helpful assistant."
          }, {
            role: "user",
            content: 'are you ok?'
          }]
        }, {
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        })/*.then(resp => {
            // response.say(resp);
            console.log(resp.data.choices[0].message.content);
        }).catch(err => {
            console.error('Error calling OpenAI API:', err);
            // response.say('Can not access OpenAI API.');
        })*/
        console.log(resp.data.choices[0].message.content);
      }
      catch (err) {

      }
}

const handleInput = async (req, res) => {
    const response = new VoiceResponse();

    console.log('handle input..');
    if(req.body.SpeechResult) {
        console.log('User said: ' + req.body.SpeechResult);
        // response.say('hi you said..');
        // response.say(req.body.SpeechResult);
        
        const openaiApiKey = process.env.YOUR_OPENAI_API_KEY;
        try {
          const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
              model: "gpt-3.5-turbo", // or any other model you prefer
              messages: [{
                role: "system",
                content: "You are a helpful assistant."
              }, {
                role: "user",
                content: req.body.SpeechResult
              }]
            }, {
              headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json'
              }
            });/*.then(resp => {
                response.say(resp.data.choices[0].message.content);
                console.log(resp.data.choices[0].message.content);
                const redirecturl = process.env.MY_URL + '/webhook/incoming-call';
                response.redirect(redirecturl);
            }).catch(err => {
                console.error('Error calling OpenAI API:', err);
                response.say('Can not access OpenAI API.');
                const redirecturl = process.env.MY_URL + '/webhook/incoming-call';
                response.redirect(redirecturl);
            })*/
            response.say(resp.data.choices[0].message.content);
            console.log(resp.data.choices[0].message.content);
            const redirecturl = process.env.MY_URL + '/webhook/incoming-call';
            response.redirect(redirecturl);
        } catch (error) {
          
        }
    } else {
        response.say('Sorry, I did not hear anything. Please try again.');
        const redirecturl = process.env.MY_URL + '/webhook/incoming-call';
        response.redirect(redirecturl);
    }

    res.type('text/xml');
    res.send(response.toString());
}

const afterRecording = (req, res) => {
    const response = new VoiceResponse();

    // Play another audio file after recording is finished
    process.env.MY_URL;
    const followUpAudioUrl = process.env.MY_URL + '/audio/taskFailed.mp3';
    response.play(followUpAudioUrl);
    console.log('after recording..');
  
    // You can add additional logic here if needed
    res.type('text/xml');
    res.send(response.toString());
}
 
const makeCall = () => {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const outgoingURL = process.env.MY_URL + '/webhook/handle-outgoing-call';
    
    console.log('making a call');

    client.calls.create({
       url: outgoingURL,
       to: '+12143771383',
       from: process.env.TWILIO_PHONE_NUMBER
     })
    .then(call => console.log(call.sid));
};

const handleOutGoing = (req, res) => {
    const response = new VoiceResponse();
    // For example, say a message to the receiver

    response.say("Hello Lus!");
    console.log('outgoing call handled..');
    response.say({ voice: 'alice.ko-KR' }, 'Hello, nice to meet you. My name is Noah. How is it going?');
    const audioUrl = process.env.MY_URL + '/audio/generated-audio.wav';
    response.play(audioUrl);

    const redirecturl = process.env.MY_URL + '/webhook/on-conversation';
    response.redirect(redirecturl);

    res.type('text/xml');
    res.send(response.toString());
}

const onConversation = (req, res) => {
    const response = new VoiceResponse();

    // Additional call logic goes here
    const actionurl = process.env.MY_URL + '/webhook/process-reply';
    response.record({
        action: actionurl, // URL of the next stage
        maxLength: 120,
        timeout: 10,
        finishOnKey: '1'
    });

    console.log('on conversation..');
    const redirecturl = process.env.MY_URL + '/webhook/on-conversation';
    response.redirect(redirecturl);

    res.type('text/xml');
    res.send(response.toString());
}

const processReply = (req, res) => {
    const response = new VoiceResponse();

    console.log('process-reply handled..');
    response.say('Hello, this is Noah again......');

    const redirecturl = process.env.MY_URL + '/webhook/on-conversation';
    response.redirect(redirecturl);

    res.type('text/xml');
    res.send(response.toString());
}

module.exports = {
    myFunc,
    incomingCall,
    handleInput,
    afterRecording,
    makeCall,
    handleOutGoing,
    processReply,
    onConversation,
    getAnswerFromGPT,
}