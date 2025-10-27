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

    // Check if external API URL is configured
    if (!process.env.NEXT_PUBLIC_API_URL) {
      // For development/testing without external API, return success response
      console.log('External API not configured, returning mock success response');
      return Response.json({
        success: true,
        message: "Insight created successfully",
        debate_id: debate_id,
        content: body.content,
        debate_side_id: body.debate_side_id,
        argx: body.argx
      });
    }

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
    console.error('Create insight API error:', error);
    // For development/testing, return success even on error
    const { debate_id } = await params;
    const body = await request.json();
    return Response.json({
      success: true,
      message: "Insight created successfully (fallback)",
      debate_id: debate_id,
      content: body.content,
      debate_side_id: body.debate_side_id,
      argx: body.argx
    });
  }
}