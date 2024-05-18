export interface Module {
  init(): Promise<void>
  start(): Promise<void>
  destroy(): Promise<void>
}