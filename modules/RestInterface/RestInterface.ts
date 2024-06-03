import { Server } from 'http';
import { Module } from '../../model/Module';
import express from 'express'

let app: express.Application
let server: Server
const PORT = 3000

const RestInterface: Module = {
  async init(): Promise<void> {
    app = express()

    app.get('/', (req, res) => {
      res.send('Vienna RESTInterface')
    })

    app.get('/vertex/query', (req, res) => getVertexQuery(req, res))
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

const getVertexQuery = async (req: express.Request, res: express.Response) => {
  res.send('Vertex Query')
}

export default RestInterface