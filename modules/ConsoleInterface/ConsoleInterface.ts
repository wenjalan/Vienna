import { Module } from '../../model/Module';
import readline, { Interface } from 'readline';
import { streamGenerateContent } from '../VertexEngine/VertexEngine';

let rl: Interface;
const CLI_PROMPT = '> '

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

  process.stdout.write('\x1Bc') 
  console.log(`> ${query}`)
  console.log('-'.repeat(50))

  const startTime = Date.now()
  const response = await streamGenerateContent(query)
  // process.stdout.write(`(${Date.now() - startTime} ms) `)

  process.stdout.write('\x1Bc') 
  console.log(`> ${query}`)
  console.log('-'.repeat(50), `${Date.now() - startTime} ms`)
  for await (const item of response.stream) {
    if (item.candidates && item.candidates[0].content.parts[0]) {
      const text = item.candidates[0].content.parts[0].text ?? '';
      // print out the text with a 2 ms delay between chars
      for (const char of text) {
        process.stdout.write(char)
        await new Promise(resolve => setTimeout(resolve, 4))
      }
    }
  }
  console.log('-'.repeat(50))
}

export default ConsoleInterface