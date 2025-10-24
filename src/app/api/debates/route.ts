export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/debates/`, {
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