import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  CoordinatorSet,
  DiceLanded,
  DiceRolled,
  OwnershipTransferRequested,
  OwnershipTransferred
} from "../generated/DiceBet/DiceBet"

export function createCoordinatorSetEvent(
  vrfCoordinator: Address
): CoordinatorSet {
  let coordinatorSetEvent = changetype<CoordinatorSet>(newMockEvent())

  coordinatorSetEvent.parameters = new Array()

  coordinatorSetEvent.parameters.push(
    new ethereum.EventParam(
      "vrfCoordinator",
      ethereum.Value.fromAddress(vrfCoordinator)
    )
  )

  return coordinatorSetEvent
}

export function createDiceLandedEvent(
  roller: Address,
  rollNumber: BigInt,
  result: BigInt
): DiceLanded {
  let diceLandedEvent = changetype<DiceLanded>(newMockEvent())

  diceLandedEvent.parameters = new Array()

  diceLandedEvent.parameters.push(
    new ethereum.EventParam("roller", ethereum.Value.fromAddress(roller))
  )
  diceLandedEvent.parameters.push(
    new ethereum.EventParam(
      "rollNumber",
      ethereum.Value.fromUnsignedBigInt(rollNumber)
    )
  )
  diceLandedEvent.parameters.push(
    new ethereum.EventParam("result", ethereum.Value.fromUnsignedBigInt(result))
  )

  return diceLandedEvent
}

export function createDiceRolledEvent(
  roller: Address,
  requestId: BigInt
): DiceRolled {
  let diceRolledEvent = changetype<DiceRolled>(newMockEvent())

  diceRolledEvent.parameters = new Array()

  diceRolledEvent.parameters.push(
    new ethereum.EventParam("roller", ethereum.Value.fromAddress(roller))
  )
  diceRolledEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromUnsignedBigInt(requestId)
    )
  )

  return diceRolledEvent
}

export function createOwnershipTransferRequestedEvent(
  from: Address,
  to: Address
): OwnershipTransferRequested {
  let ownershipTransferRequestedEvent =
    changetype<OwnershipTransferRequested>(newMockEvent())

  ownershipTransferRequestedEvent.parameters = new Array()

  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferRequestedEvent
}

export function createOwnershipTransferredEvent(
  from: Address,
  to: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferredEvent
}
