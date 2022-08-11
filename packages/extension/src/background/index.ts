import { ActionItem } from "../shared/actionQueue"
import { MessageType, messageStream } from "../shared/messages"
import { handleAddressMessage } from "./addressMessaging"
import { handleActionMessage } from "./actionMessaging"
import { getQueue } from "./actionQueue"
import {
  hasTab,
  sendMessageToActiveTabs,
  sendMessageToActiveTabsAndUi,
} from "./activeTabs"
import {
  BackgroundService,
  HandleMessage,
  UnhandledMessage,
} from "./background"
import { getNetwork as getNetworkImplementation } from "./customNetworks"
import { getMessagingKeys } from "./keys/messagingKeys"
import { handleMiscellaneousMessage } from "./miscellaneousMessaging"
import { handleNetworkMessage } from "./networkMessaging"
import { handlePreAuthorizationMessage } from "./preAuthorizationMessaging"
import { handleRecoveryMessage } from "./recoveryMessaging"
import { handleSessionMessage } from "./sessionMessaging"
import { Storage } from "./storage"
import { handleTransactionMessage } from "./transactions/transactionMessaging"
import { Wallet, WalletStorageProps } from "./wallet"
  ; (async () => {
    const messagingKeys = await getMessagingKeys()
    const storage = new Storage<WalletStorageProps>({}, "wallet")

    const onAutoLock = () =>
      sendMessageToActiveTabsAndUi({ type: "DISCONNECT_ADDRESS" })
    const wallet = new Wallet(storage, getNetworkImplementation, onAutoLock)

    const actionQueue = await getQueue<ActionItem>({
      onUpdate: (actions) => {
        sendMessageToActiveTabsAndUi({
          type: "ACTIONS_QUEUE_UPDATE",
          data: { actions },
        })
      },
    })

    const background: BackgroundService = {
      wallet,
      actionQueue,
    }

    const handlers = [
      handleAddressMessage,
      handleActionMessage,
      handleMiscellaneousMessage,
      handleNetworkMessage,
      handlePreAuthorizationMessage,
      handleRecoveryMessage,
      handleSessionMessage,
      handleTransactionMessage,
    ] as Array<HandleMessage<MessageType>>

    messageStream.subscribe(async ([msg, sender]) => {
      const sendToTabAndUi = async (msg: MessageType) => {
        sendMessageToActiveTabsAndUi(msg, [sender.tab?.id])
      }

      // forward UI messages to rest of the tabs
      if (!hasTab(sender.tab?.id)) {
        sendMessageToActiveTabs(msg)
      }

      for (const handleMessage of handlers) {
        try {
          await handleMessage({
            msg,
            sender,
            background,
            messagingKeys,
            sendToTabAndUi,
          })
        } catch (error) {
          if (error instanceof UnhandledMessage) {
            continue
          }
          throw error
        }
        break
      }
    })
  })()
