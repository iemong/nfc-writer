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
  if (!(event.request.url.indexOf("http") === 0)) return
  event.respondWith(
    caches.match(event.request).then(
      (cacheResponse) =>
        cacheResponse ||
        fetch(event.request).then((response) => {
          if (response.ok) {
            return caches.open(version).then((cache) => {
              cache.put(event.request, response.clone())
              return response
            })
          }
          return Promise.reject(
            "Invalid response.  URL:" +
              response.url +
              " Status: " +
              response.status
          )
        })
    )
  )
})
