const express = require('express');
const router = express.Router();

const twilioController = require('../controllers/twilioController');

router.post('/incoming-call', twilioController.incomingCall);
router.post('/after-recording', twilioController.afterRecording);
router.post('/handle-input', twilioController.handleInput);
router.get('/make-call', twilioController.makeCall);
router.post('/handle-outgoing-call', twilioController.handleOutGoing);
router.post('/process-reply', twilioController.processReply);
router.post('/on-conversation', twilioController.onConversation);
router.get('/get-answer', twilioController.getAnswerFromGPT);

module.exports = router;