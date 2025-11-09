import { AuthTokens } from "./types";
import { env } from "@/config/env";

export class TokenManager {
  static setTokens(tokens: AuthTokens): void {
    if (!tokens.accessToken || !tokens.refreshToken) {
      return;
    }

    localStorage.setItem(env.accessTokenKey, tokens.accessToken);
    localStorage.setItem(env.refreshTokenKey, tokens.refreshToken);
  }

  static getAccessToken(): string | null {
    const token = localStorage.getItem(env.accessTokenKey);
    return token && token !== "undefined" && token !== "null" ? token : null;
  }

  static getRefreshToken(): string | null {
    const token = localStorage.getItem(env.refreshTokenKey);
    return token && token !== "undefined" && token !== "null" ? token : null;
  }

  static clearTokens(): void {
    localStorage.removeItem(env.accessTokenKey);
    localStorage.removeItem(env.refreshTokenKey);
  }

  static hasTokens(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const hasValid = accessToken !== null && refreshToken !== null;
    return hasValid;
  }
}
