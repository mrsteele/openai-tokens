interface ModelInfo {
  tokens: number
  price: number
}

declare function getModel(model?: string): ModelInfo

declare namespace getModel {
  let defaultModel: string
  function getModel(model?: string): ModelInfo
  function resolveModel(model?: string): ModelInfo | null
  function listSupportedModels(): string[]
  function registerModel(model: string, info: ModelInfo): ModelInfo
  function registerModels(entries: Record<string, ModelInfo>): string[]
}

export = getModel
