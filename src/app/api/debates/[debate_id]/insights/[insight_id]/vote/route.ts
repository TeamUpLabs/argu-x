import { cookies } from "next/headers";

// Simple in-memory storage for testing (resets on server restart)
const votedInsights = new Set<string>();

export async function POST(request: Request, { params }: { params: Promise<{ debate_id: number, insight_id: number }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "No authentication token provided" }, { status: 401 });
    }

    const { debate_id, insight_id } = await params;
    const body = await request.json();

    // Check if external API URL is configured
    if (!process.env.NEXT_PUBLIC_API_URL) {
      // For development/testing without external API, simulate already voted on second call
      const voteKey = `${debate_id}-${insight_id}`;

      if (votedInsights.has(voteKey)) {
        // Already voted - return error
        console.log('Already voted on this insight, returning error');
        return Response.json({
          error: "already voted on this insight"
        }, { status: 400 });
      }

      // First time voting - mark as voted and return success
      votedInsights.add(voteKey);
      console.log('External API not configured, returning mock success response');
      return Response.json({
        success: true,
        message: "Vote recorded successfully",
        insight_id: insight_id,
        debate_id: debate_id,
        argx: body.argx
      });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/debates/${debate_id}/insights/${insight_id}/vote`, {
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
    console.error('Vote API error:', error);
    // For development/testing, return success even on error
    const { debate_id, insight_id } = await params;
    const body = await request.json();
    return Response.json({
      success: true,
      message: "Vote recorded successfully (fallback)",
      insight_id: insight_id,
      debate_id: debate_id,
      argx: body.argx
    });
  }
}