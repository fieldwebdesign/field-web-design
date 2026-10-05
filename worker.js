export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/reviews" && request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT id, name, rating, review, created_at FROM reviews WHERE approved = 1 ORDER BY created_at DESC"
      ).all();

      return Response.json(results);
    }

    if (url.pathname === "/api/reviews" && request.method === "POST") {
      const data = await request.json();

      if (!data.name || !data.review || !data.rating) {
        return Response.json(
          { error: "Please complete all fields." },
          { status: 400 }
        );
      }

      await env.DB.prepare(
        "INSERT INTO reviews (name, rating, review, approved) VALUES (?, ?, ?, 0)"
      )
        .bind(data.name, data.rating, data.review)
        .run();

      return Response.json({
        success: true,
        message: "Thank you! Your review has been submitted for approval."
      });
    }

    return env.ASSETS.fetch(request);
  }
};
