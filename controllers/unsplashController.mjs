import axios from "axios";

export async function getUnsplashPic(req, res) {

	const key = process.env.UNSPLASH_KEY;
	const url = "https://api.unsplash.com/photos/random"
	try {
		const params = new URLSearchParams({
			client_id: key,
			count: 1,
			query: req.params.query,
			orientation: "landscape"
		})

		const response = await axios.get(`${url}?${params.toString()}`)
		return res.send(response.data);
	}

	catch (err) {
		return res.status(err.response?.status ?? 500).send({ message: err.response?.data?.message || "Something went wrong!" })
	}
}