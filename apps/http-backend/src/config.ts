import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from ".";
import { db } from "@repo/db/prismaClient";

interface authRequest extends Request {
  user: {
    id: string;
    nfl: string;
  };
  cookies: {
    __uIt: string;
  };
}

export function authenticator(req: Request, res: Response, next: NextFunction) {
  const authreq = req as authRequest;
  const authHeader = req.cookies["__uIt"] || authreq.headers["authorization"];
  //console.log(authHeader);
  const token = authHeader;
  if (!token) {
    // console.log("Token not present");
    res.status(401).json({ message: "Unauthenticated! please sign-in again!" });
    return;
  }

  try {
    // console.log(JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    const userId = decoded.userId;
    const nfl = decoded.nfl;
    // console.log(`Authenticator ! User-Id : ${userId}`);
    authreq.user = { id: userId, nfl: nfl };
    next();
  } catch (error) {
    // console.log("token got expired");
    res
      .status(401)
      .json({ message: "User is unauthenticated! please sign-in again!" });
  }
}

// Helper function for background PID updates
export async function updateLegacyPidsAsync(
  items: Array<{ id: number; pid: string }>,
) {
  try {
    await db.$transaction(
      items.map((item) =>
        db.chat.updateMany({
          where: {
            id: item.id,
            publicId: null, // Only update if still null (idempotent)
          },
          data: {
            publicId: item.pid,
          },
        }),
      ),
    );

    // console.log(`✅ Successfully updated ${items.length} legacy PIDs`);
  } catch (error) {
    console.error("❌ Failed to update legacy PIDs:", error);
    // Don't throw - this is a background task
  }
}
