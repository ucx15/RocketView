const path = require('path')
const express = require('express')

const PORT = 3000
const publicPath = path.join(__dirname, 'Public')


const app = express()
app.use(express.static('Public'))


app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
