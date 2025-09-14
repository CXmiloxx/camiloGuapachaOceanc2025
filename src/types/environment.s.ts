declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "test" | "production";
    PORT: string;
    GOOGLE_API_KEY: string;
  }
}
