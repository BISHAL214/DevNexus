import { prisma } from "@/lib/prisma"; // Ensure your Prisma client is set up
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ userId: string }>;
export async function GET(req: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const userId = params.userId;
    console.log("User ID:", userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.log("User not found");
      return NextResponse.json(
        {
          success: false,
          error: true,
          message: "User not found",
          user_data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        error: false,
        message: "User Found",
        user_data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching user data:", error);
    return NextResponse.json(
      {
        success: false,
        error: true,
        message: "Something went wrong",
        user_data: null,
      },
      { status: 500 }
    );
  }
}
