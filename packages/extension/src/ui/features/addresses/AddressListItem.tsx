import { FC, ReactNode } from "react"
import styled from "styled-components"

import { formatTruncatedAddress } from "../../services/addresses"

export interface IAddressListItem {
  accountName: string
  accountAddress: string
  focus?: boolean
  children?: ReactNode
  // ...rest
  [x: string]: any
}

type AddressListItemWrapperProps = Pick<IAddressListItem, "focus">

export const AddressListItemWrapper = styled.div<AddressListItemWrapperProps>`
  cursor: pointer;
  background-color: ${({ focus }) =>
    focus ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)"};
  border-radius: 4px;
  padding: 20px 16px;
  border: 1px solid
    ${({ focus }) => (focus ? "rgba(255, 255, 255, 0.3)" : "transparent")};

  display: flex;
  gap: 12px;
  align-items: center;

  transition: all 200ms ease-in-out;

  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.15);
    outline: 0;
  }
`

const AccountColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const AccountRow = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
`

const AccountName = styled.h1`
  font-weight: 700;
  font-size: 18px;
  line-height: 18px;
  margin: 0 0 5px 0;
`

const AccountAddress = styled.div`
  font-size: 13px;
`

export const AddressListItem: FC<IAddressListItem> = ({
  accountName,
  accountAddress,
  focus,
  children,
  ...rest
}) => {
  return (
    <AddressListItemWrapper focus={focus} {...rest}>
      <AccountRow>
        <AccountColumn>
          <AccountName>{accountName}</AccountName>
          <AccountAddress>
            {formatTruncatedAddress(accountAddress)}
          </AccountAddress>
        </AccountColumn>
        <AccountColumn>{children}</AccountColumn>
      </AccountRow>
    </AddressListItemWrapper>
  )
}
