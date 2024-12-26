import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import getOrCreateDB from "./models/server/dbSetup";
import getOrCreateStorage from "./models/server/storageSetup";
import env from "./env";

export async function middleware(requset: NextRequest) {
  console.log("Middleware");

  await Promise.all([getOrCreateDB(), getOrCreateStorage()]);
  return NextResponse.next();
}

// Paths where this middleware should not run
export const config = {
  /*
    - api
    - _next/static
    - _next/image
    - favicon.ico
    */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
