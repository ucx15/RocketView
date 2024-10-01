
const fs = require('fs')

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')


dotenv.config({ path: __dirname + "\\.env.local" })

const PORT = process.env.PORT || 5000

const app = express()

app.use(
	cors({
		origin: '*'
	})
)


/* DATA SCHEMA
{
	"cityName": {
		"about": "string",
		"placesToVisit": ["string"],
		"hotels": ["string"],
		"restaurants": ["string"],
		"howToReach": "string",
		"images": ["string", "string", ...],
		"reviews": ["string"]

	},
	...
}
*/
const cityData = JSON.parse(fs.readFileSync('./Data/db.json'))
const cityNames = Object.keys(cityData)


app.get('/api/city/:name', (req, res) => {
	const cityName = req.params.name.toLowerCase()
	if (cityData[cityName]) {
		res.json(cityData[cityName])
	} else {
		res.status(404).json({ message: "City not found" })
	}
})

app.get('/api/cities', (req, res) => {
	res.json(cityNames)
})


app.get('/', (req, res) => {
	res.send('try http://.../api/city/:<name> or http://.../api/cities')
})


app.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`)
})

