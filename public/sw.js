const version = "v1"

self.addEventListener("install", (event) => {
  console.log("service worker install ...", event)

  event.waitUntil(
    caches.open(version).then((cache) => {
      return cache.addAll(["/dist/index.js"])
    })
  )
})

self.addEventListener("activate", (event) => {
  console.info("activate", event)
})

self.addEventListener("fetch", (event) => {
  console.log("fetch", event)

  event.respondWith(
    caches.match(event.request).then(
      (cacheResponse) =>
        cacheResponse ||
        fetch(event.request).then((response) =>
          caches.open(version).then((cache) => {
            cache.put(event.request, response.close())
            return response
          })
        )
    )
  )
})
