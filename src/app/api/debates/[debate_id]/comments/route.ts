import { cookies } from "next/headers";

export async function POST(request: Request, { params }: { params: Promise<{ debate_id: number }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "No authentication token provided" }, { status: 401 });
    }

    const body = await request.json();
    const { debate_id } = await params;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/debates/${debate_id}/comments`, {
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
    return Response.json({ error: "Failed to add comment" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ debate_id: number, comment_id: number }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "No authentication token provided" }, { status: 401 });
    }

    const body = await request.json();
    const { debate_id } = await params;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/debates/${debate_id}/comments/${body.comment_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(data, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}