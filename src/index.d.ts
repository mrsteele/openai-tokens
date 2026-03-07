export interface ModelInfo {
  tokens: number
  price: number
}

export interface Message {
  role: string
  content: string
}

export interface TokenOpts {
  limit?: number
  buffer?: number
  stringify?: boolean
}

export interface CompletionBody {
  model: string | string[]
  messages: Message[]
  opts?: TokenOpts
  [key: string]: unknown
}

export interface EmbeddingBody {
  model: string | string[]
  input: string | string[]
  opts?: TokenOpts
  [key: string]: unknown
}

export interface ValidateResult {
  tokenLimit: number
  tokenTotal: number
  valid: boolean
  cost: number
}

export interface ClientConfig {
  json?: boolean
  truncate?: boolean
  buffer?: number | null
  limit?: number | null
  key?: string | null
  gptModels?: string[]
  embeddingModels?: string[]
}

export interface RequestOpts {
  limit?: number
  buffer?: number
}

export interface GPTRequestObject {
  messages: Message[]
  opts?: RequestOpts
  [key: string]: unknown
}

export interface EmbedRequestObject {
  input: string | string[]
  opts?: RequestOpts
  [key: string]: unknown
}

export interface OpenAITokensClient {
  gpt(args?: string | Message[] | GPTRequestObject): Promise<unknown>
  embed(args?: string | string[] | EmbedRequestObject): Promise<unknown>
}

export function validateWrapper(body: CompletionBody | EmbeddingBody): ValidateResult
export function validateMessage(content?: string, model?: string): boolean
export function truncateWrapper(body: CompletionBody | EmbeddingBody): CompletionBody | EmbeddingBody | string
export function truncateMessage(content: string, model?: string, limit?: number): string
export function dynamicWrapper(body: CompletionBody | EmbeddingBody): CompletionBody | EmbeddingBody | string
export function createClient(config?: ClientConfig): OpenAITokensClient
export function listSupportedModels(): string[]
export function resolveModel(model?: string): ModelInfo | null
export function registerModel(model: string, info: ModelInfo): ModelInfo
export function registerModels(entries: Record<string, ModelInfo>): string[]
export const defaultModel: string
