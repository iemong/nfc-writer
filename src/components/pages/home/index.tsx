import React, { useState, useEffect } from "react"
import styles from "./style.module.css"

const Home = (): JSX.Element => {
  const [data, setData] = useState<DataView|undefined>()
  const [type, setType] = useState('')

  useEffect(() => {
    const f = async () => {
      if (!('NDEFReader' in window)) return
      try {
        const reader = new NDEFReader()
        await reader.scan()
        reader.addEventListener('error', (e) => {
          console.error(e)
        })
        reader.addEventListener('reading', (e) => {
          const {message} = e as NDEFReadingEvent
          const record = message.records[0]
          const { data , recordType} = record
          setData(data)
          setType(recordType)
        })
      }
      catch (e) {
        console.error(e)
      }
    }
    f()
  }, [])

  return (
    <div className={styles.Home}>
      <header className={styles.HomeHeader}>
        <h1>WEB NFC Reader</h1>
        <p>data: {data}</p>
        <p>type: {type}</p>
      </header>
    </div>
  )
}

export default Home
