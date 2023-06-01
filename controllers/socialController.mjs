import SocialLib from "../libs/socialLib.mjs";
import * as v from "../utils/validation.mjs";

// Create contact-request
export async function createContactRequest(req, res) {
	try {
		// Validation
		if (!v.isAsciiString(req.params.destUserName, 8)) return res.status(400).send({message: "Bad request"}) ;

  	await SocialLib.addContactRequest(req.session.userId, req.params.destUserName) ;
		return res.send({ result: true }) ;
	}
	catch(err) {
		if (err === "USER_NOT_FOUND") return res.status(404).send({message: "User not found"}) ;
		else if (err === "ALREADY_EXISTS") return res.status(409).send({message: "You have already sent this user a contact request"}) ;
		else if (err === "ALREADY_CONTACT") return res.status(409).send({message: "This user is already a contact"}) ;
		else if (err === "SAME_USER") return res.status(409).send({message: "You cannot send a contact request to yourself"}) ;
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Accept contact-request
export async function acceptContactRequest(req, res) {
	// Validation
	if (!v.isAsciiString(req.params.sourceUserName, 8)) return res.status(400).send({message: "Bad request"}) ;

	try {
  	await SocialLib.acceptContactRequest(req.params.sourceUserName, req.session.userId) ;
		return res.send({ result: true }) ;
	}
	catch(err) {
		if (err === "USER_NOT_FOUND") return res.status(404).send({message: "User not found"}) ;
		else if (err === "NO_CONTACT_REQUEST") return res.status(404).send({message: "Contact request not found"}) ;
		else if (err === "ALREADY_CONTACT") return res.status(409).send({message: "This user is already a contact"}) ;
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Reject contact-request
export async function rejectContactRequest(req, res) {
	// Validation
	if (!v.isAsciiString(req.params.sourceUserName, 8)) return res.status(400).send({message: "Bad request"}) ;

	try {
  	await SocialLib.removeContactRequest(req.params.sourceUserName, req.session.userId) ;
		return res.send({ result: true }) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Remove contact
export async function removeContact(req, res) {
	// Validation
	if (!v.isAsciiString(req.params.contactUserName, 8)) return res.status(400).send({message: "Bad request"}) ;

	try {
  	await SocialLib.removeContact(req.params.contactUserName, req.session.userId) ;
		return res.send({ result: true }) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Retrieve contacts
export async function retrieveContacts(req, res) {
	try {
  	const contacts = await SocialLib.retrieveContacts(req.session.userId) ;
		return res.send(contacts) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Send message
export async function sendMessage(req, res) {
	// Validation
	if (!v.isAsciiString(req.params.destUserName, 8)) return res.status(400).send({message: "Bad request"}) ;
	if (!v.isString(req.body.messageSubject)) return res.status(400).send({message: "Bad request"}) ;
	if (!v.isString(req.body.messageContent)) return res.status(400).send({message: "Bad request"}) ;

	try {
  	await SocialLib.createMessage(req.session.userId, req.params.destUserName, req.body.messageSubject, req.body.messageContent) ;
		return res.send({ result: true }) ;
	}
	catch(err) {
		if (err === "NOT_CONTACT") return res.status(403).send({message: "User is not on your contacts list"}) ;
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Retrieve message metadata
export async function retrieveMessageMetas(req, res) {
	try {
  	const messageMetas = await SocialLib.retrieveMessageMetas(req.session.userId) ;
		return res.send(messageMetas) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Remove message
export async function removeMessage(req, res) {
	// Validation
	if (!v.isAsciiString(req.params.messageId)) return res.status(400).send({message: "Bad request"}) ;

	try {
  	await SocialLib.removeMessage(req.session.userId, req.params.messageId) ;
		return res.send({ result: true }) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Retrieve message content
export async function retrieveMessageContent(req, res) {
	// Validation
	if (!v.isAsciiString(req.params.messageId)) return res.status(400).send({message: "Bad request"}) ;

	try {
  	const message = await SocialLib.retrieveMessageContent(req.session.userId, req.params.messageId) ;
		return res.send(message) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Get usernames and profile images for users matching given criteria
export async function findUsers(req, res) {	
	// Validation
	if (req.params.userNameSubString === '_' && req.params.userLocation === '_' && req.params.userAge === '_') return res.status(400).send({message: "Bad request"}) ;
	if (req.params.userNameSubString !== '_' && !v.isAlphaNumString(req.params.userNameSubString, 3)) return res.status(400).send({message: "Bad request"}) ;
	if (!v.isAsciiString(req.params.userLocation)) return res.status(400).send({message: "Bad request"}) ;
	if (!v.isAsciiString(req.params.userAge)) return res.status(400).send({message: "Bad request"}) ;
	
	const userNameSubString = (req.params.userNameSubString === '_') ? null : req.params.userNameSubString ;
	const userLocation = (req.params.userLocation === '_') ? null : req.params.userLocation ;
	const userAge = (req.params.userAge === '_') ? null : req.params.userAge ;

	try {
  	const userNames = await SocialLib.findUsers(req.session.userId, userNameSubString, userLocation, userAge) ;
		return res.send(userNames) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}
