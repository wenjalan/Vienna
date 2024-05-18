import { Module } from '../../model/Module';
import readline, { Interface } from 'readline';

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

    rl.prompt()
    rl.on('line', (input: string) => {
      if (input === 'exit') {
        rl.close()
      } else {
        handleQuery(input)
        rl.prompt()
      }
    })
  },

  async destroy(): Promise<void> {
    rl.close()
  }
}

const handleQuery = (query: string) => {
  console.log(`Received query: ${query}`)
}

export default ConsoleInterface