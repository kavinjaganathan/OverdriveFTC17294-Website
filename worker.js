// Serves the team site's static files, and forwards /STEM to StemCycle Pickup
// (a separate Next.js app on Vercel, built with basePath "/STEM").
//
// Configure in wrangler.jsonc / the Cloudflare dashboard:
//   STEMCYCLE_ORIGIN        var    e.g. https://stemcycle-pickup.vercel.app
//   STEMCYCLE_PROXY_SECRET  secret same value as PROXY_SECRET in the app, so it
//                                  can trust the visitor IP sent below (rate limits)

const PREFIX = '/STEM'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname !== PREFIX && !url.pathname.startsWith(`${PREFIX}/`)) {
      return env.ASSETS.fetch(request)
    }
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
