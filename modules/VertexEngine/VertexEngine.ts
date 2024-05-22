import { Module } from "../../model/Module";
import { ChatSession, Content, GenerationConfig, GenerativeModel, Part, StreamGenerateContentResult, VertexAI } from "@google-cloud/vertexai";

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

const VertexEngine: Module = {
  async init(): Promise<void> {
    vertexAI = new VertexAI({ project: PROJECT, location: LOCATION })
    generativeModel = vertexAI.getGenerativeModel({
      model: MODEL, 
      generationConfig: CONFIG,
    })
    chat = generativeModel.startChat({
      systemInstruction: SYSTEM_INSTRUCTION,
    })
  },

  async start(): Promise<void> {
    
  },

  async destroy(): Promise<void> {
    console.log('Vertex Engine destroyed')
  }
}

export async function streamGenerateContent(input: string): Promise<StreamGenerateContentResult> {
  const request: Part[] = [{ text: input }]

  const result = await chat.sendMessageStream(request)
  return result
}

export default VertexEngine