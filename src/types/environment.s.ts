declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "test" | "production";
    PORT: string;
    GOOGLE_API_KEY: string;
    NASA_API_KEY:string;
    DATABASE_URL:string;
  }
}
