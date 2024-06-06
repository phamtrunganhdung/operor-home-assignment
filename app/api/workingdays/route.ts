import { NextRequest, NextResponse } from "next/server";
import users from "../../file/users.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const count: number = parseInt(searchParams.get("count") || "");
  if (users) return NextResponse.json(users.slice(0, count ? count : 10));
  else return NextResponse.json({ message: "Data not found" }, { status: 404 });
}
