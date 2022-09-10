require('dotenv').config()

export default {
	mongoUrl: process.env.MONGO_URL || 'localhost:270',
	port: process.env.MONGO_PORT || 5050
}
