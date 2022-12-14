import { Balance } from "@alephium/sdk/api/alephium"
import { FC, useEffect, useRef, useState } from "react"
import styled from "styled-components"

import { CopyTooltip } from "../../components/CopyTooltip"
import { ContentCopyIcon } from "../../components/Icons/MuiIcons"
import { formatTruncatedAddress } from "../../services/addresses"
import { getBalance } from "../../services/backgroundAddresses"
import { AddressName } from "./AddressName"
import { AddressWrapper, Address } from "./Address"
import { useNetworkState } from "../networks/networks.state"

const Header = styled.div`
  display: flex;
  align-items: center;
  width: 250px;
`

const Balance = styled.div`
  font-weight: 600;
  font-size: 17px;
  text-align: center;
  color: ${({ theme }) => theme.text2};
  margin-bottom: 8px;
`

const Group = styled.div`
  text-align: center;
  font-weight: 800;
`

interface AddressSubHeaderProps {
  address: string
  group: number
  addressName?: string
  onChangeName: (name: string) => void
}

export const AddressSubHeader: FC<AddressSubHeaderProps> = ({
  address,
  group,
  onChangeName,
  addressName,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [balance, setBalance] = useState<Balance | undefined>(undefined)
  const { switcherNetworkId } = useNetworkState()

  useEffect(() => {
    getBalance(address).then((balance) => {
      setBalance(balance)
    })
  }, [address, switcherNetworkId])

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            alignSelf: "center",
            width: 250,
          }}
        >
          <Header>
            <AddressName
              value={addressName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChangeName(e.target.value)
              }
              inputRef={inputRef}
            />
          </Header>
        </div>
      </div>
      <Balance>{balance?.balanceHint}</Balance>
      <AddressWrapper style={{ marginBottom: 18 }}>
        <CopyTooltip copyValue={address} message="Copied!">
          <Address>
            {formatTruncatedAddress(address)}
            <ContentCopyIcon style={{ fontSize: 12 }} />
          </Address>
        </CopyTooltip>
        <Group>Group {group}</Group>
      </AddressWrapper>
    </>
  )
}
