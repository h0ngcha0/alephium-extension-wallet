import { fireEvent, render, screen } from "@testing-library/react"
import { describe, test } from "vitest"

import { ArrayStorage } from "../array"
import { useArrayStorage, useKeyValueStorage, useObjectStorage } from "../hooks"
import { KeyValueStorage } from "../keyvalue"
import { ObjectStorage } from "../object"
import { chromeStorageMock } from "./chrome-storage.mock"

describe("useKeyValueStorage()", () => {
  test("should render with storage values", async () => {
    const store = new KeyValueStorage(
      {
        message: "Hello World!",
      },
      "ui-test-kv",
      chromeStorageMock,
    )

    function Component() {
      const data = useKeyValueStorage(store, "message")
      return (
        <div>
          <p>{data}</p>
          <button
            onClick={() => {
              store.setItem("message", "Bye World!")
            }}
          >
            change value
          </button>
        </div>
      )
    }
    render(<Component />)

    await screen.findByText("Hello World!")
    fireEvent.click(screen.getByText("change value"))
    await screen.findByText("Bye World!")
  })
})

describe("useObjectStorage()", () => {
  test("should render with storage values", async () => {
    const store = new ObjectStorage(
      "Hello World!",
      "ui-test-object",
      chromeStorageMock,
    )

    function Component() {
      const data = useObjectStorage(store)
      return (
        <div>
          <p>{data}</p>
          <button
            onClick={() => {
              store.set("Bye World!")
            }}
          >
            change value
          </button>
        </div>
      )
    }
    render(<Component />)

    await screen.findByText("Hello World!")
    fireEvent.click(screen.getByText("change value"))
    await screen.findByText("Bye World!")
  })
})

describe("useArrayStorage()", () => {
  test("should render with storage values", async () => {
    const store = new ArrayStorage(
      ["Hello", "World!"],
      "ui-test-array",
      chromeStorageMock,
    )

    function Component() {
      const data = useArrayStorage(store)
      return (
        <div>
          <p>{data.join(" ")}</p>
          <button
            onClick={() => {
              store.add("See you tomorrow!")
            }}
          >
            change value
          </button>
        </div>
      )
    }
    render(<Component />)

    await screen.findByText("Hello World!")
    fireEvent.click(screen.getByText("change value"))
    await screen.findByText("Hello World! See you tomorrow!")
  })
})
