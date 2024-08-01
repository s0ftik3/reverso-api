declare module 'reverso-api' {
  global {
    export interface ReversoResponse {
      ok: boolean,
      text: string,
      source: string,
      target: string,
      translation: string[],
      examples: {
        id: number,
        source: string,
        target: string,
      }[]
    }

    export interface ReversoErrorResponse {
      ok: boolean,
      message: string,
    }
  }

  type CallbackFunction = (error: ReversoErrorResponse, response: ReversoResponse) => void;

  export default class Reverso {
    constructor({ insecureHTTPParser = false }?: { insecureHTTPParser: boolean });
    getContext(text: string, source: string, target: string, callback?: CallbackFunction): ReversoResponse;
  }
}