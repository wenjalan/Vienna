import { Module } from '../../model/Module';
import readline, { Interface } from 'readline';
import { streamGenerateContent } from '../VertexEngine/VertexEngine';

let rl: Interface;
const CLI_PROMPT = '> '
const CLEAR_AFTER_QUERY = true
let CHAR_DELAY = 4

const ConsoleInterface: Module = {
  async init(): Promise<void> {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.setPrompt(CLI_PROMPT)
  },

  async start(): Promise<void> {
    process.stdout.write('\x1Bc') 
    console.log('='.repeat(50))
    console.log('>'.repeat(19) + ' Vienna CLI ' + '<'.repeat(19))
    console.log('='.repeat(50))
    console.log()
    console.log()
    console.log('Type "exit" to quit, or enter a query.')
    console.log()
    console.log()

    rl.prompt()
    rl.on('line', async (input: string) => {
      if (input === 'exit') {
        rl.close()
      } else {
        await handleQuery(input)
        rl.prompt()
      }
    })
  },

  async destroy(): Promise<void> {
    process.stdout.write('\x1Bc') 
    rl.close()
  }
}

const handleQuery = async (query: string) => {
  // console.log(`Received query: ${query}`)
  if (query.length === 0) return

  if (CLEAR_AFTER_QUERY) {
    process.stdout.write('\x1Bc') 
    console.log(`> ${query}`)
    console.log('='.repeat(50))
  }

  const startTime = Date.now()
  const response = await streamGenerateContent(query, false)
  const latency = Date.now() - startTime

  if (CLEAR_AFTER_QUERY) {
    process.stdout.write('\x1Bc') 
    console.log(`> ${query}`)
  }
  const latencyString = `${latency} ms`
  console.log('='.repeat(50 - latencyString.length - 1), latencyString)
  for await (const item of response.stream) {
    // fuck this condition
    if (item.candidates && item.candidates[0].content.parts[0] && item.candidates[0].content.parts[0].text) {
      const text = item.candidates[0].content.parts[0].text;
      await printDramatically(text, CHAR_DELAY)
    }
  }
  console.log('='.repeat(50))
}

const printDramatically = async (text: String, delay: number): Promise<void> => {
  for (const char of text) {
    process.stdout.write(char)
    await new Promise(resolve => setTimeout(resolve, delay))
  }
}

export default ConsoleInterface