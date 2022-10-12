// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

export default {
  mongoUrl: process.env.MONGO_URL || 'localhost:270',
  port: process.env.MONGO_PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'Tl@s13s.'
}
