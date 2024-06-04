import * as fs from 'fs'
import * as path from 'path'

process.stdout.write('\x1Bc')
console.log('='.repeat(50))
console.log('>'.repeat(21) + ' Vienna ' + '<'.repeat(21))
console.log('='.repeat(50))

const start = async (args: string[]) => {
  const pathToModules = path.join(__dirname, 'modules')
  // console.log(`Loading modules from ${pathToModules}...`);
  let modulePaths = await loadModules(pathToModules)
  console.log(`Found ${modulePaths.length} module(s)`)

  // if args specifies --singleModule, only load module
  if (args.length > 0 && args[0] === '--singleModule') {
    const singleModuleName = args[1]
    modulePaths = modulePaths.filter(modulePath => modulePath.includes(singleModuleName))
    console.log(`\tFound ${modulePaths.length} module(s) matching '${args[1]}'`)
  }

  // if args specifies --exclude, remove module(s)
  if (args.length > 0 && args[0] === '--exclude') {
    const excludedModules = args.slice(1)
    modulePaths = modulePaths.filter(modulePath => !excludedModules.some(excludedModule => modulePath.includes(excludedModule)))
    console.log(`\tExcluded ${excludedModules.length} module(s)`)
  }

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

const args = process.argv.slice(2)
start(args)