import React, { useState, useEffect } from "react"
import styles from "./style.module.css"
import { Button } from "~/components/atoms/button"

const Home = (): JSX.Element => {
  const [reader, setReader] = useState<NDEFReader | undefined>()
  const [data, setData] = useState<DataView|undefined>()
  const [type, setType] = useState('')

  const setup = () => {
    if (!('NDEFReader' in window)) return
    const r = new NDEFReader()
    setReader(r)
    r.addEventListener('error', (e) => {
      console.error(e)
    })
    r.addEventListener('reading', (e) => {
      const {message} = e as NDEFReadingEvent
      const record = message.records[0]
      const { data , recordType} = record
      setData(data)
      setType(recordType)
    })
  }

  const scan = async () => {
    if(!reader) return
    try {
      await reader.scan()
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
        <Button type="primary" label="Setup" onClick={setup}/>
        <Button type="primary" label="scan" onClick={scan}/>
      </header>
    </div>
  )
}

export default Home
