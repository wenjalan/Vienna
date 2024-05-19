import { Module } from "../../model/Module";
import { GenerationConfig, GenerativeModel, StreamGenerateContentResult, VertexAI } from "@google-cloud/vertexai";

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

const VertexEngine: Module = {
  async init(): Promise<void> {
    vertexAI = new VertexAI({ project: PROJECT, location: LOCATION })
    generativeModel = vertexAI.getGenerativeModel({
      model: MODEL, 
      generationConfig: CONFIG,
    })
  },

  async start(): Promise<void> {
    
  },

  async destroy(): Promise<void> {
    console.log('Vertex Engine destroyed')
  }
}

export async function streamGenerateContent(input: string): Promise<StreamGenerateContentResult> {
  const request = {
    contents: [{role: 'user', parts: [
      {text: prompt},  
      {text: input}
    ]}],
  };

  const result = await generativeModel.generateContentStream(request)
  return result
}

export default VertexEngine