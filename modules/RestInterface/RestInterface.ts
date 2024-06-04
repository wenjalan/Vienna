import { Server } from 'http';
import { Module } from '../../model/Module';
import VertexEngine from '../VertexEngine/VertexEngine';
import express from 'express'
import bodyParser from 'body-parser'

let app: express.Application
let server: Server
const PORT = 3000

const RestInterface: Module = {
  async init(): Promise<void> {
    app = express()
    app.use(bodyParser.json())

    // API routes
    const apiRouter = express.Router()
    apiRouter.use('/vertex', await VertexEngine.router())
    app.use('/api', apiRouter)
  },

  async start(): Promise<void> {
    server = app.listen(PORT, () => {
      console.log(`RESTInterface listening on port ${PORT}`)
    })
  },

  async destroy(): Promise<void> {
    server.close()
  }
}

export default RestInterface