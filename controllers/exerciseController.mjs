import axios from "axios";
import getCustomWorkoutModel from "../models/customWorkout.mjs";
import getUserDataModel from "../models/userData.mjs"

export async function getBodyparts(req, res) {
	const key = process.env.EXERCISEAPI;
	const url = "https://exercisedb.p.rapidapi.com/exercises/bodyPartList"
	try {
		const response = await axios.get(`${url}`,
			{
				headers: {
					"X-RapidAPI-Key": key,
					'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
				}
			})
		
		return res.send(response.data);
	}
	catch (err) {
		return res.status(err.response?.status ?? 500).send({ message: err.response?.data?.message || "Something went wrong!" })
	}
}

export async function getExercise(req, res) {
	const key = process.env.EXERCISEAPI;
	const bodypart = req.params.bodypart;
	const url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodypart}`
	try {
		const response = await axios.get(`${url}`,
			{
				headers: {
					"X-RapidAPI-Key": key,
					'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
				}
			})

		return res.send(response.data);
	}
	catch (err) {
		return res.status(err.response?.status ?? 500).send({ message: err.response?.data?.message || "Something went wrong!" })
	}
}

export async function addCustomWorkout(req, res) {
	const UserData = getUserDataModel() ;
	const CustomWorkout = getCustomWorkoutModel() ;

	try {
		const userData = await UserData.findOne({ _id: req.session.userId });
		const customWorkout = new CustomWorkout(req.body);
		customWorkout.date = new Date();
		customWorkout.username = userData.userProfile.userName;
		await customWorkout.save();

		userData.customWorkouts.push(customWorkout.id);
		await userData.save();
		return res.send({ message: "Custom workout added!" });
	}
	catch (err) {
		console.log(err)
		return res.status(500).send({ message: "Something went wrong!" })
	}
}

export async function getCustomWorkouts(req, res) {
	const CustomWorkout = getCustomWorkoutModel() ;

	try {
		const customWorkouts = await CustomWorkout.find();
		return res.send(customWorkouts);
	}
	catch (err) {
		console.log(err)
		return res.status(500).send({ message: "Something went wrong!" })
	}
}

export async function getCustomWorkoutsForuser(req, res) {
	const UserData = getUserDataModel() ;
	const CustomWorkout = getCustomWorkoutModel() ;

	try {
		const userData = await UserData.findOne({ _id: req.session.userId });
		const customWorkouts = await CustomWorkout.find({ id: { $in: userData.customWorkouts } });
		return res.send(customWorkouts);
	}
	catch (err) {
		console.log(err)
		return res.status(500).send({ message: "Something went wrong!" })
	}
}