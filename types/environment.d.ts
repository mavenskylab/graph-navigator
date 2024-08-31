export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // DGRAPH
      DGRAPH_ENDPOINT: string;
      DGRAPH_KEY: string;
    }
  }
}
