import getUserValueHistoryModel from "../models/userValueHistory.mjs";
import UserValueHistoryLib from "../libs/userValueHistoryLib.mjs";
import ProfileLib from "../libs/profileLib.mjs";
import * as v from "../utils/validation.mjs";

// Get first known value for value-history for current user and given field
export async function getFirstValueForField(req, res) {
	const UserValueHistory = getUserValueHistoryModel() ;

	// Validation
	const fieldName = req.params.fieldName ;
	if (!v.isStringOneOf(fieldName, ['weight', 'height'])) return res.status(400).send({message: "Bad request"}) ;

	try {
  	const valueHistory = await UserValueHistory.findOne({_id: req.session.userId, [`historyValues.${fieldName}`] : {$exists: true}}).sort({ dateOnly: 1 })
		return res.send({ value: valueHistory?.historyValues[0][fieldName] }) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Get all value-history for the current user
export async function getAllHistory(req, res) {
	const UserValueHistory = getUserValueHistoryModel() ;

	try {
  	const valueHistory = await UserValueHistory.findOne({_id: req.session.userId}).sort({ dateOnly: 1 }) ;
		return res.send(valueHistory) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"}) ;
	}
}

// Set a history value for the current user and given date / field
export async function setHistoryFieldValue(req, res) {
	// Validation
	const dateOnlyString = req.params.dateOnly ;
	// TODO: Validate date string

	const fieldName = req.params.fieldName ;
	if (!v.isStringOneOf(fieldName, ['weight', 'height'])) return res.status(400).send({message: "Bad request"}) ;

	const value = req.body.value ;
	if (!v.isNumeric(value)) return res.status(400).send({message: "Bad request"}) ;

	const dateOnlyStringToday = new Date().toISOString().split('T')[0] ;

	try {
		let updatedExisting ;
		console.log(dateOnlyString, dateOnlyStringToday, dateOnlyString === dateOnlyStringToday) ;
  	if (dateOnlyString === dateOnlyStringToday) updatedExisting = ProfileLib.updateField(req.session.userId, fieldName, value)
		else updatedExisting = UserValueHistoryLib.updateFieldForDate(req.session.userId, dateOnlyString, fieldName, value) ;
		if (!updatedExisting) return res.status(404).send({message: "Not found"}) ;
  	return res.send({ profileUpdated: (dateOnlyString === dateOnlyStringToday) }) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}