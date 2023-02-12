import express, { type Express } from 'express'
import path from 'path'

export default (app: Express): void => {
  app.use('/static', express.static(path.resolve(__dirname, '../../static')))
}
