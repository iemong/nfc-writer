import React from "react"
import ReactDOM from "react-dom"
import App from "~/components/app/"
import "~/assets/styles/index.css"

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept()
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js", { scope: "/" })
    .then((reg) => {
      console.log("登録に成功しました。 Scope は " + reg.scope)
    })
    .catch((err) => {
      console.log("登録に失敗しました。" + err)
    })
}
