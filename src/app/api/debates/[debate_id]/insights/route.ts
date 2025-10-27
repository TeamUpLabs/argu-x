import { cookies } from "next/headers";

export async function POST(request: Request, { params }: { params: Promise<{ debate_id: number }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "No authentication token provided" }, { status: 401 });
    }

    const { debate_id } = await params;
    const body = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/debates/${debate_id}/insights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(data, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create insight" }, { status: 500 });
  }
}