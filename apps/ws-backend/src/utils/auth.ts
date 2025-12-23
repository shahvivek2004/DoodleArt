import jwt, { JwtPayload } from "jsonwebtoken";
import env from "dotenv";

env.config();
export function tokenExtraction(url: string): string {
  const queryParams = new URLSearchParams(url.split("?")[1]);
  return queryParams.get("token") || "";
}

export function checkUser(token: string): string | null {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET not configured");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded || !decoded.userId || typeof decoded === "string") {
      return null;
    }
    return decoded.userId;
  } catch (error) {
    return null;
  }
}
