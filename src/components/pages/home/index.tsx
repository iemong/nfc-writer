import React, { useRef, useState } from "react"
import styles from "./style.module.css"
import { Button } from "~/components/atoms/button"

const Home = (): JSX.Element => {
  const isFirst = useRef(true)
  const [data, setData] = useState<DataView|undefined>()
  const [type, setType] = useState('')

  const scan = async () => {
    if (!('NDEFReader' in window)) return
    const reader = new NDEFReader()
    try {
      await reader.scan()

      if(!isFirst.current) return
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
      isFirst.current = false
    }
    catch (e) {
      console.error(e)
    }
  }

  return (
    <div className={styles.Home}>
      <header className={styles.HomeHeader}>
        <h1>WEB NFC Reader</h1>
        <p>data: {data}</p>
        <p>type: {type}</p>
        <Button type="primary" label="scan" onClick={scan}/>
      </header>
    </div>
  )
}

export default Home
