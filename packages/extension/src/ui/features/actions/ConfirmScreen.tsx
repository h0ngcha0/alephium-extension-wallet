import { FC, FormEvent, ReactNode, useState } from "react"
import Measure from "react-measure"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

import { Address } from "../../../shared/Address"
import {
  Button,
  ButtonGroupVertical,
  ButtonVariant,
} from "../../components/Button"
import { H2 } from "../../theme/Typography"

const ConfirmScreenWrapper = styled.form<{
  addressShown: boolean
  smallTopPadding: boolean
}>`
  display: flex;
  flex-direction: column;
  padding: ${({ smallTopPadding }) => (smallTopPadding ? "16px" : "48px")} 32px
    0;
  ${({ addressShown }) => (addressShown ? `padding-top: 0;` : ``)}

  > ${H2} {
    margin: 0 0 40px;
  }
`

export interface ConfirmPageProps {
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void
  onReject?: () => void
  selectedAddress?: Address
}

interface ConfirmScreenProps extends ConfirmPageProps {
  title?: string
  rejectButtonText?: string
  confirmButtonText?: string
  confirmButtonDisabled?: boolean
  confirmButtonBackgroundColor?: string
  confirmButtonVariant?: ButtonVariant
  singleButton?: boolean
  switchButtonOrder?: boolean
  smallTopPadding?: boolean
  showHeader?: boolean
  footer?: ReactNode
  children: ReactNode
}

export const StickyGroup = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 32px 24px;

  background-color: ${({ theme }) => theme.bg1};
  background: linear-gradient(
    180deg,
    rgba(16, 16, 16, 0.4) 0%,
    ${({ theme }) => theme.bg1} 73.72%
  );
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
  z-index: 100;

  > * + * {
    margin-top: 24px;
  }

  ${({ theme }) => theme.mediaMinWidth.sm`
    left: ${theme.margin.extensionInTab};
    right: ${theme.margin.extensionInTab};
  `}
`

const Placeholder = styled.div`
  width: 100%;
  margin-top: 8px;
`

export const ConfirmScreen: FC<ConfirmScreenProps> = ({
  title,
  confirmButtonText = "Confirm",
  confirmButtonDisabled,
  confirmButtonBackgroundColor,
  confirmButtonVariant,
  rejectButtonText = "Reject",
  onSubmit,
  onReject,
  selectedAddress,
  singleButton = false,
  switchButtonOrder = false,
  smallTopPadding = false,
  showHeader = true,
  footer,
  children,
  ...props
}) => {
  const navigate = useNavigate()
  const [placeholderHeight, setPlaceholderHeight] = useState(100)
  onReject ??= () => navigate(-1)

  return (
    <ConfirmScreenWrapper
      smallTopPadding={smallTopPadding}
      addressShown={Boolean(showHeader && selectedAddress)}
      onSubmit={(e) => {
        e.preventDefault()
        return onSubmit?.(e)
      }}
      {...props}
    >
      {title && <H2>{title}</H2>}

      {children}

      <Placeholder
        style={{
          height: placeholderHeight,
        }}
      />
      <Measure
        bounds
        onResize={(contentRect) => {
          const { height = 100 } = contentRect.bounds || {}
          setPlaceholderHeight(height)
        }}
      >
        {({ measureRef }) => (
          <StickyGroup ref={measureRef}>
            {footer}
            <ButtonGroupVertical switchButtonOrder={switchButtonOrder}>
              {!singleButton && (
                <Button onClick={onReject} type="button">
                  {rejectButtonText}
                </Button>
              )}
              <Button
                disabled={confirmButtonDisabled}
                style={{
                  backgroundColor: confirmButtonDisabled
                    ? undefined
                    : confirmButtonBackgroundColor,
                }}
                variant={confirmButtonVariant}
                type="submit"
              >
                {confirmButtonText}
              </Button>
            </ButtonGroupVertical>
          </StickyGroup>
        )}
      </Measure>
    </ConfirmScreenWrapper>
  )
}
