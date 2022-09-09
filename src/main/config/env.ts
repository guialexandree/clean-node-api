require('dotenv').config()

export default {
	mongoUrl: process.env.MONGO_URL,
	port: process.env.MONGO_PORT
}
