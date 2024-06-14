import { Module } from "../../model/Module"

const InternetEngine: Module = {
  async init(): Promise<void> {},

  async start(): Promise<void> {},

  async destroy(): Promise<void> {},

}

export async function get(url: string): Promise<Response> {
  const response: Response = await fetch(url)
  return response
}

export default InternetEngine