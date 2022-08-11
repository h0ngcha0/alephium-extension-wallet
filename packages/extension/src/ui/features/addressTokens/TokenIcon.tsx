import { FC } from "react"
import styled from "styled-components"

const Icon = styled.img<{ size: number }>`
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  border-radius: ${({ size }) => size}px;
  flex: 0;

  /* add min values so it reserves the space while loading */
  min-height: ${({ size }) => size}px;
  min-width: ${({ size }) => size}px;
`

interface TokenIconProps {
  name: string
  url?: string
  large?: boolean
  small?: boolean
  size?: number
}

export const TokenIcon: FC<TokenIconProps> = ({
  name,
  url,
  large = false,
  small = false,
  size,
}) => {
  const color = "FF5C72"
  return (
    <Icon
      size={size ? size : large ? 48 : small ? 24 : 40}
      alt={name}
      src={
        url ||
        `https://eu.ui-avatars.com/api/?name=${name}&background=${color}&color=fff`
      }
    />
  )
}
