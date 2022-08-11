import { sendMessage, waitForMessage } from "../../shared/messages"
import { decryptFromBackground, generateEncryptedSecret } from "./crypto"

export const connectAddress = (address: string) => {
  sendMessage({
    type: "CONNECT_ACCOUNT",
    data: { address },
  })
}

export const createNewAddress = async (group?: number) => {
  sendMessage({ type: "NEW_ACCOUNT", data: group })
  return await Promise.race([
    waitForMessage("NEW_ACCOUNT_RES"),
    waitForMessage("NEW_ACCOUNT_REJ"),
  ])
}

export const deleteAccount = async (address: string) => {
  sendMessage({
    type: "DELETE_ACCOUNT",
    data: { address },
  })

  try {
    await Promise.race([
      waitForMessage("DELETE_ACCOUNT_RES"),
      waitForMessage("DELETE_ACCOUNT_REJ").then(() => {
        throw new Error("Rejected")
      }),
    ])
  } catch {
    throw Error("Could not delete account")
  }
}

export const getLastSelectedAddress = async () => {
  sendMessage({ type: "GET_SELECTED_ACCOUNT" })
  return waitForMessage("GET_SELECTED_ACCOUNT_RES")
}

export const getAddresses = async () => {
  sendMessage({ type: "GET_ACCOUNTS" })
  return waitForMessage("GET_ACCOUNTS_RES")
}

export const getBalance = async (address: string) => {
  sendMessage({ type: "GET_ACCOUNT_BALANCE", data: { address } })
  return waitForMessage("GET_ACCOUNT_BALANCE_RES")
}

export const getSeedPhrase = async (): Promise<string> => {
  const { secret, encryptedSecret } = await generateEncryptedSecret()
  sendMessage({
    type: "GET_ENCRYPTED_SEED_PHRASE",
    data: { encryptedSecret },
  })

  const { encryptedSeedPhrase } = await waitForMessage(
    "GET_ENCRYPTED_SEED_PHRASE_RES",
  )

  return await decryptFromBackground(encryptedSeedPhrase, secret)
}
