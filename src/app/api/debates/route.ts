import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    let category = request.nextUrl.searchParams.get("category");

    if (!category) {
      category = request.headers.get("category");
    }
    
    const url = category 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/debates?category=${category}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/debates/`;
      
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch debates" }, { status: 500 });
  }
}