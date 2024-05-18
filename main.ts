import * as fs from 'fs'
import * as path from 'path'

process.stdout.write('\x1Bc')
console.log('='.repeat(50))
console.log('>'.repeat(21) + ' Vienna ' + '<'.repeat(21))
console.log('='.repeat(50))

const start = async () => {
  const pathToModules = path.join(__dirname, 'modules')
  // console.log(`Loading modules from ${pathToModules}...`);
  const modulePaths = await loadModules(pathToModules)
  console.log(`Found ${modulePaths.length} module(s)`)

  console.log(`Initializing module(s)...`)
  const initModulesResult = await initModules(modulePaths)
  console.log(`Initialized ${initModulesResult.success.length}/${modulePaths.length} module(s) successfully`)
  const modules = initModulesResult.success


  console.log(`Starting module(s)...`)
  modules.forEach(module => module.default.start())
}

const loadModules = async (moduleDir: string) => {
  const moduleFiles = fs.readdirSync(moduleDir)
  const modulePaths = moduleFiles.map(file => path.join(moduleDir, file, file))
  return modulePaths
}

const initModules = async (modulePaths: string[]) => {
  const success = []
  const failed = []
  for await (const modulePath of modulePaths) {
    const moduleName = modulePath.split(`/`).pop() ?? 'unknown'
    const module = await import(modulePath)
    try {
      await module.default.init()
      console.log(`\t${moduleName} initialized`)
      success.push(module)
    } catch (error: any) {
      console.error(`\t${moduleName} failed to initialize: ${error.message}`)
      failed.push(module)
    }
  }
  return { success, failed }
}

start()