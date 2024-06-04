import express, { Router } from "express";
import { Module } from "../../model/Module";
import { ChatSession, Content, GenerateContentResponse, GenerationConfig, GenerativeModel, Part, StreamGenerateContentResult, VertexAI } from "@google-cloud/vertexai";
import { pipeline } from "stream/promises";
import { RestModule } from "../../model/RestModule";

const PROJECT = 'vienna-423723'
const LOCATION = 'us-west1'
const MODEL = 'gemini-1.5-flash-preview-0514'

const CONFIG: GenerationConfig = {
  topK: 10,
  candidateCount: 1,
}

const SYSTEM_INSTRUCTION: Content = {
  role: 'system',
  parts: [
    { text: 'You are Vienna, a multi-domain AI assistant. Respond to inquires from the user using concise language.' }
  ]
}

let vertexAI: VertexAI
let generativeModel: GenerativeModel
let chat: ChatSession

const VertexEngine: RestModule = {
  async init(): Promise<void> {
    vertexAI = new VertexAI({ project: PROJECT, location: LOCATION })
    generativeModel = vertexAI.getGenerativeModel({
      model: MODEL,
      generationConfig: CONFIG,
    })
    chat = generativeModel.startChat({
      systemInstruction: SYSTEM_INSTRUCTION,
    })

    // send a warmup message to the model, otherwise it takes ~15 seconds for the first response
    setTimeout(async () => {
      await chat.sendMessage("SYSTEM: The user has initiated the chat.")
    }, 0)
  },

  async start(): Promise<void> {
  },

  async destroy(): Promise<void> {
    console.log('Vertex Engine destroyed')
  },

  async router(): Promise<Router> {
    const router: Router = express.Router()
    // test command:
    // curl -X POST -H "Content-Type: application/json" -d '{"query":"Who were the first 10 Presidents of the United States?"}' http://localhost:3000/api/vertex/query -N 
    router.post('/query', async (req, res) => {
      try {
        const query: string = req.body.query
        const response: StreamGenerateContentResult = await streamGenerateContent(query)
        const stream: AsyncGenerator<GenerateContentResponse> = response.stream

        // custom stream to convert GenerateContentResponse to string
        const responseStream = {
          [Symbol.asyncIterator]: async function* () {
            for await (const item of stream) {
              // fuck this condition
              if (item.candidates && item.candidates[0].content.parts[0] && item.candidates[0].content.parts[0].text) {
                const text = item.candidates[0].content.parts[0].text;
                yield text
              }
            }
          }
        }
        await pipeline(responseStream, res)
      } catch (err) {
        console.error(err)
        res.status(500).send(err)
      }
    })
    return router
  }
}

export async function streamGenerateContent(input: string, markdown = true): Promise<StreamGenerateContentResult> {
  const request: Part[] = []
  if (!markdown) request.push({ text: 'SYSTEM: Respond to the following inquiry without using markdown.' })
  request.push({ text: input })

  const result = await chat.sendMessageStream(request)
  return result
}

export default VertexEngine