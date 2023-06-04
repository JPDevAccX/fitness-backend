import axios from "axios";

export async function getQuotes(req, res) {
    const key = process.env.QUOTES_API_KEY;
    const url = "https://quotes15.p.rapidapi.com/topic"
    try {
        const response = await axios.post(`${url}`,
            {
                headers: {
                    "X-RapidAPI-Key": key,
                    'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
                },
                data: {
                    "topic": "motivational",
                    "pageSize": 1,
                    "page": 1
                }
            })
        return res.send(response.data);
    }
    catch (err) {
        return res.status(err.response?.status ?? 500).send({ message: err.response?.data?.message || "Something went wrong!" })
    }
}
