import { FC, useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

import { useAppState } from "../../app.state"
import { Header } from "../../components/Header"
import { IconButton } from "../../components/IconButton"
import { AddIcon, SettingsIcon } from "../../components/Icons/MuiIcons"
import { routes } from "../../routes"
import { makeClickable } from "../../services/a11y"
import { connectAddress } from "../../services/backgroundAddresses"
import { H1, P } from "../../theme/Typography"
import { deployAddress } from "../addresses/addresses.service"
import { useAddresses } from "../addresses/addresses.state"
import { NetworkSwitcher } from "../networks/NetworkSwitcher"
import { recover } from "../recovery/recovery.service"
import { Container } from "./AddressContainer"
import { AddressHeader } from "./AddressHeader"
import { AddressListScreenItem } from "./AddressListScreenItem"
import { InputText } from "../../components/InputText"

const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 48px 32px;
`

const AddressListWrapper = styled(Container)`
  display: flex;
  flex-direction: column;

  ${H1} {
    text-align: center;
  }

  > ${AddressList} {
    width: 100%;
  }
`

const IconButtonCenter = styled(IconButton)`
  margin: auto;
`

const Paragraph = styled(P)`
  text-align: center;
`

const AddContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 40%;
  margin: auto;
`

export const AddressListScreen: FC = () => {
  const navigate = useNavigate()
  const { addresses, selectedAddress, addAddress } = useAddresses()
  const [group, setGroup] = useState<any>(undefined)

  const addressesList = Object.values(addresses)

  const isValidGroup = (group: any) => {
    if (!group) {
      return true
    }

    const groupInt = parseInt(group)
    return !isNaN(groupInt) && (group >= 0 || group <= 3)
  }

  const handleAddAddress = async () => {
    useAppState.setState({ isLoading: true })
    try {
      if (isValidGroup(group)) {
        const newAddress = await deployAddress(group)
        addAddress(newAddress)
        connectAddress({
          address: newAddress.hash,
          publicKey: newAddress.publicKey,
          addressIndex: newAddress.group
        })
        navigate(await recover())
      }
    } catch (error: any) {
      useAppState.setState({ error: `${error}` })
      navigate(routes.error())
    } finally {
      useAppState.setState({ isLoading: false })
    }
  }

  return (
    <AddressListWrapper header>
      <AddressHeader>
        <Header>
          <IconButton
            size={36}
            {...makeClickable(() => navigate(routes.settings()), {
              label: "Settings",
              tabIndex: 99,
            })}
          >
            <SettingsIcon />
          </IconButton>
          <NetworkSwitcher />
        </Header>
      </AddressHeader>
      <H1>Addresses</H1>
      <AddressList>
        {addressesList.length === 0 && (
          <Paragraph>
            No address, click below to add one.
          </Paragraph>
        )}
        {addressesList.map((address) => (
          <AddressListScreenItem
            key={address.hash}
            address={address}
            selectedAddress={selectedAddress}
          />
        ))}
        <AddContainer>
          <InputText
            type="number"
            placeholder="group"
            style={{ width: "3em", marginBottom: "0.5em" }}
            defaultValue={group}
            min={0}
            max={3}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGroup(e.target.value)
            }
          />
          {
            isValidGroup(group) ?
              (
                <IconButtonCenter
                  size={48}
                  {...makeClickable(handleAddAddress, { label: "Create new wallet" })}
                >
                  <AddIcon fontSize="large" />
                </IconButtonCenter>

              ) : null
          }
        </AddContainer>
      </AddressList>
    </AddressListWrapper>
  )
}
