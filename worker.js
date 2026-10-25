// Serves the team site's static files, and forwards /STEM to StemCycle Pickup
// (a separate Next.js app, built with basePath "/STEM").
//
// Preferred: StemCycle runs as the Cloudflare Worker "stemcycle-pickup" and is
// reached through the STEMCYCLE service binding in wrangler.jsonc (no public
// hop; Cloudflare passes the visitor's CF-Connecting-IP through).
// Alternative: STEMCYCLE_ORIGIN (var) = the app's public URL elsewhere, with
// STEMCYCLE_PROXY_SECRET (secret) = the app's PROXY_SECRET.

const PREFIX = '/STEM'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname !== PREFIX && !url.pathname.startsWith(`${PREFIX}/`)) {
      return env.ASSETS.fetch(request)
    }
    if (env.STEMCYCLE) return env.STEMCYCLE.fetch(request)
    if (!env.STEMCYCLE_ORIGIN) {
      return new Response('StemCycle Pickup is not available yet. Please check back soon.', {
        status: 503,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      })
    }

    const origin = new URL(env.STEMCYCLE_ORIGIN)
    const target = new URL(url.pathname + url.search, origin)
    const headers = new Headers(request.headers)
    headers.set('x-forwarded-host', url.host)
    headers.set('x-forwarded-proto', url.protocol.replace(':', ''))
    const ip = request.headers.get('cf-connecting-ip')
    if (ip && env.STEMCYCLE_PROXY_SECRET) {
      headers.set('x-stemcycle-client-ip', ip)
      headers.set('x-stemcycle-proxy-secret', env.STEMCYCLE_PROXY_SECRET)
    } else {
      headers.delete('x-stemcycle-client-ip')
      headers.delete('x-stemcycle-proxy-secret')
    }

    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    })

    // Keep visitors on ftcoverdrive.org if the app redirects to its own host.
    const response = new Response(upstream.body, upstream)
    const location = response.headers.get('location')
    if (location) {
      const loc = new URL(location, target)
      if (loc.host === origin.host) {
        response.headers.set('location', `${url.origin}${loc.pathname}${loc.search}${loc.hash}`)
      }
    }
    return response
  },
}
