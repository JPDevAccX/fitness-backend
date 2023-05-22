import { MONGO_ERR_DUPLICATE_KEY } from "../utils/errcodes.mjs";
import getUserValueHistoryModel from "../models/userValueHistory.mjs";

export default class UserValueHistoryLib {
	static async initialHistorySetup(userId) {
		const UserValueHistory = getUserValueHistoryModel() ;

		const userValueHistory = new UserValueHistory({_id: userId}) ;
		try {
			await userValueHistory.save() ;
		}
		catch(err) {
			if (err.code !== MONGO_ERR_DUPLICATE_KEY) throw (err) ; // Unknown error
			// (ignore duplicate key error)
		}
	}

	static async setFieldForCurrentDay(userId, fieldName, value) {
		const UserValueHistory = getUserValueHistoryModel() ;
		
		const dateOnlyString = new Date().toISOString().split('T')[0] ;
		const updatedExisting = await UserValueHistoryLib.updateFieldForDate(userId, dateOnlyString, fieldName, value) ;

		if (!updatedExisting) {
			const historyEntryData = { dateOnly: dateOnlyString, [fieldName]: value } ;
			const filter = { _id: userId } ;
			const update = { $push: { historyValues: historyEntryData }} ;
			await UserValueHistory.updateOne(filter, update);
		}

		return updatedExisting ;
	}

	static async updateFieldForDate(userId, dateOnlyString, fieldName, value) {
		const UserValueHistory = getUserValueHistoryModel() ;

		const filter = { _id: userId, "historyValues.dateOnly": dateOnlyString } ;
		const update = { $set: { [`historyValues.$[elem].${fieldName}`]: value } } ;
		const arrayFilters = [{ "elem.dateOnly": dateOnlyString }] ;
		
		const res = await UserValueHistory.updateOne(filter, update, {arrayFilters}) ;

		return (res.matchedCount !== 0) ;
	}
}