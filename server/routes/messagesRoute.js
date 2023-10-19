const { addMessage, getMessage } = require("../controllers/messagesController")
const router = require("express").Router();
router.post("/addMessage", addMessage);
router.post("/getMessage", getMessage);
module.exports = router;