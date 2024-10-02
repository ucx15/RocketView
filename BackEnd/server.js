
const fs = require('fs')
const path = require('path')
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
		"reviews": ["string"],
	},

	...
}
*/


// Paths
const imagesDir = path.join(__dirname, './Data/Images/Cities/');

// Data
const cityData = JSON.parse(fs.readFileSync('./Data/db.json'))
const cityNames = Object.keys(cityData)


// GET routes

// Get all city names
app.get('/api/cities', (req, res) => {
	res.json(cityNames)
})


// Get data for a specific city
app.get('/api/city/:name/data', (req, res) => {
	const cityName = req.params.name.toLowerCase()
	if (cityData[cityName]) {
		res.json(cityData[cityName])
	} else {
		res.status(404).json({ message: "City not found" })
	}
})

// Get the number of images for a specific city
app.get('/api/city/:name/images/', (req, res) => {
	const cityName = req.params.name.toLowerCase()

	if (cityData[cityName]) {
		const dirPath = path.join(__dirname, `./Data/Images/Cities/${cityName}`)

		fs.readdir(dirPath, (error, files) => {
			if (error) {
				console.error(`Error reading directory: ${error.message}`)
				res.status(500).json({ message: "Internal server error" })
				return
			}

			let totalFiles = files.length
			res.json({"nImages": totalFiles})
		})

	} else {
		res.status(404).json({ message: "City not found" })
	}
})


// Get images for a specific city
app.get('/api/city/:name/images/:id', (req, res) => {
	const cityName = req.params.name.toLowerCase()
	const id = req.params.id

	if (cityData[cityName]) {
		const imagePath = path.join(__dirname, `./Data/Images/Cities/${cityName}/${id}.jpg`);
		if (fs.existsSync) {
			res.sendFile(imagePath)
		}
		else {
			res.status(404).json({ message: "Image not found" })
		}

	} else {
		res.status(404).json({ message: "City not found" })
	}
})



app.get('/', (req, res) => {
	res.send('try http://.../api/city/:<name> or http://.../api/cities')
})


app.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`)
})

