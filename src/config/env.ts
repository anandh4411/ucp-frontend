interface EnvironmentConfig {
  API_BASE_URL: string;
  API_VERSION: string;
  API_TIMEOUT: number;
  API_REFRESH_TIMEOUT: number;
  APP_NAME: string;
  APP_VERSION: string;
  NODE_ENV: "development" | "production" | "test";
  ENABLE_DEV_TOOLS: boolean;
  DISABLE_AUTH_GUARD: boolean;
  ACCESS_TOKEN_KEY: string;
  REFRESH_TOKEN_KEY: string;
}

class Environment {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): EnvironmentConfig {
    return {
      API_BASE_URL:
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
      API_VERSION: import.meta.env.VITE_API_VERSION || "/v1",
      API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || "10000", 10),
      API_REFRESH_TIMEOUT: parseInt(
        import.meta.env.VITE_API_REFRESH_TIMEOUT || "5000",
        10
      ),
      APP_NAME: import.meta.env.VITE_APP_NAME || "Impressaa",
      APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
      NODE_ENV: import.meta.env.MODE as "development" | "production" | "test",
      ENABLE_DEV_TOOLS:
        import.meta.env.VITE_ENABLE_DEV_TOOLS === "true" ||
        import.meta.env.MODE === "development",
      DISABLE_AUTH_GUARD: import.meta.env.VITE_DISABLE_AUTH_GUARD === "true",
      ACCESS_TOKEN_KEY:
        import.meta.env.VITE_ACCESS_TOKEN_KEY || "impressaa_access_token",
      REFRESH_TOKEN_KEY:
        import.meta.env.VITE_REFRESH_TOKEN_KEY || "impressaa_refresh_token",
    };
  }

  private validateConfig(): void {
    const required = [
      "API_BASE_URL",
      "APP_NAME",
      "API_VERSION",
      "ACCESS_TOKEN_KEY",
      "REFRESH_TOKEN_KEY",
    ];

    for (const key of required) {
      if (!this.config[key as keyof EnvironmentConfig]) {
        throw new Error(`Missing required environment variable: VITE_${key}`);
      }
    }
  }

  get apiBaseUrl(): string {
    return this.config.API_BASE_URL;
  }

  get apiVersion(): string {
    return this.config.API_VERSION;
  }

  get apiTimeout(): number {
    return this.config.API_TIMEOUT;
  }

  get apiRefreshTimeout(): number {
    return this.config.API_REFRESH_TIMEOUT;
  }

  get appName(): string {
    return this.config.APP_NAME;
  }

  get appVersion(): string {
    return this.config.APP_VERSION;
  }

  get isDevelopment(): boolean {
    return this.config.NODE_ENV === "development";
  }

  get isProduction(): boolean {
    return this.config.NODE_ENV === "production";
  }

  get enableDevTools(): boolean {
    return this.config.ENABLE_DEV_TOOLS;
  }

  get isAuthGuardDisabled(): boolean {
    return this.config.DISABLE_AUTH_GUARD;
  }

  get accessTokenKey(): string {
    return this.config.ACCESS_TOKEN_KEY;
  }

  get refreshTokenKey(): string {
    return this.config.REFRESH_TOKEN_KEY;
  }
}

export const env = new Environment();
