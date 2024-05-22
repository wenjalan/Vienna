import { Module } from "../../model/Module";
import { ChatSession, GenerationConfig, GenerativeModel, Part, StreamGenerateContentResult, VertexAI } from "@google-cloud/vertexai";

const PROJECT = 'vienna-423723'
const LOCATION = 'us-west1'
const MODEL = 'gemini-1.5-flash-preview-0514'

const CONFIG: GenerationConfig = {
  topK: 10,
  candidateCount: 1,
}

const prompt = 'You are Vienna, a multi-domain AI assistant. Respond to the user without using markdown.'

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
    chat = generativeModel.startChat()
  },

  async start(): Promise<void> {
    
  },

  async destroy(): Promise<void> {
    console.log('Vertex Engine destroyed')
  }
}

export async function streamGenerateContent(input: string): Promise<StreamGenerateContentResult> {
  const request: Part[] = [
    {text: prompt},  
    {text: input}
  ]

  // const result = await generativeModel.generateContentStream(request)
  const result = await chat.sendMessageStream(request)
  return result
}

export default VertexEngine