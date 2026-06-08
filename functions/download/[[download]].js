export async function onRequest({ request, env }) {

  const url = new URL(request.url);
  const fileName = url.pathname.substring(10);

  try {
    const object = await env.R2_BUCKET.get(fileName);
    if (object === null) {
      return new Response('File not found', { status: 404 });
    }
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata.contentType || 'application/octet-stream'
      },
    });
  } catch (err) {
    return new Response('Error fetching file', { status: 500 });
  }
}