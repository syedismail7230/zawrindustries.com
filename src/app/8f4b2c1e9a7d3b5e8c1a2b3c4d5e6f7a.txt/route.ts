export async function GET() {
  return new Response('8f4b2c1e9a7d3b5e8c1a2b3c4d5e6f7a', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
