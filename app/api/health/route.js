export async function GET() {
  try {
    // Проверяем подключение к API
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL || "https://test.aquadaddy.app/"
    );

    if (!response.ok) {
      throw new Error("API недоступен");
    }

    return Response.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        api: "connected",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message,
        api: "disconnected",
      },
      { status: 503 }
    );
  }
}
