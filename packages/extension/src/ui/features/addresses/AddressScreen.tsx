import { FC, ReactNode } from "react"

import { assertNever } from "../../services/assertNever"
import { AccountActivity } from "../accountActivity/AccountActivity"
import { AccountTokens } from "../addressTokens/AccountTokens"
import { useSelectedAddress } from "../addresses/addresses.state"
import { AddressContainer } from "./AddressContainer"

interface AddressScreenProps {
  tab: "assets" | "activity"
}

export const AddressScreen: FC<AddressScreenProps> = ({ tab }) => {
  const address = useSelectedAddress()

  let body: ReactNode
  if (!address) {
    body = <></>
  } else if (tab === "assets") {
    body = <AccountTokens address={address} />
  } else if (tab === "activity") {
    body = <AccountActivity address={address} />
  } else {
    assertNever(tab)
  }

  return <AddressContainer>{body}</AddressContainer>
}
