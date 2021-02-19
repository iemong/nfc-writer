import React, { useRef, useState } from "react"
import styles from "./style.module.css"
import { Button } from "~/components/atoms/button"

const Home = (): JSX.Element => {
  const isFirstScan = useRef(true)
  const [data, setData] = useState<string>("")
  const [type, setType] = useState("")
  const [url, setUrl] = useState("")
  const [overwrite, setOverwrite] = useState(false)
  const [tempReader, setReader] = useState<NDEFReader | undefined>()
  const [tempWriter, setWriter] = useState<NDEFReader | undefined>()

  const scan = async () => {
    if (!("NDEFReader" in window)) {
      alert("this browser is not supported WEB NFC")
      return
    }
    const reader = tempReader || new NDEFReader()
    if (!tempReader) setReader(reader)
    try {
      await reader.scan()

      if (!isFirstScan.current) return
      reader.addEventListener("error", (e) => {
        console.error(e)
      })
      reader.addEventListener("reading", (e) => {
        const { message } = e as NDEFReadingEvent
        const record = message.records[0]

        if (record.recordType !== "url") {
          console.warn("recordType is not url.")
          return
        }
        const textDecoder = new TextDecoder()
        setData(textDecoder.decode(record.data))
        setType(record.recordType)
      })
      isFirstScan.current = false
    } catch (e) {
      console.error(e)
    }
  }

  const changeUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  const changeCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOverwrite(e.target.checked)
  }

  const write = async () => {
    if (!("NDEFReader" in window)) {
      alert("this browser is not supported WEB NFC")
      return
    }
    const writer = tempWriter || new NDEFReader()
    if (!tempReader) setWriter(writer)
    try {
      const urlRecord = {
        recordType: "url",
        data: url,
      }
      await writer.write({
        records: [urlRecord],
      })
      alert("wrote NFC Tag!")
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className={styles.Home}>
      <header className={styles.HomeHeader}>
        <section>
          <h1>WEB NFC Reader</h1>
          <p>data: {data}</p>
          <p>type: {type}</p>
          <Button type="primary" label="scan" onClick={scan} />
        </section>
        <section>
          <h1>WEB NFC Writer</h1>
          <div>
            <input
              type="url"
              name="url"
              required={true}
              placeholder={"https://example.com"}
              onChange={changeUrlInput}
              className={"text-gray-500"}
            />
          </div>
          <div>
            <label htmlFor="check">
              <input
                type="checkbox"
                onChange={changeCheckBox}
                checked={overwrite}
              />
              <span>overwrite</span>
            </label>
          </div>
          <Button type="primary" label="write" onClick={write} />
        </section>
      </header>
    </div>
  )
}

export default Home
