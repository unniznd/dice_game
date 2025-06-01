// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test} from "forge-std/Test.sol";
import {DiceBet} from "../src/DiceBet.sol";

// Mock VRF Coordinator for testing
contract MockVRFCoordinatorV2Plus {
    uint256 private requestIdCounter = 1;
    address private consumer;

    event RandomWordsRequested(
        uint256 requestId,
        address requester,
        uint256 subId,
        uint32 numWords
    );

    function requestRandomWords(
        bytes32 /* keyHash */,
        uint256 /* subId */,
        uint16 /* requestConfirmations */,
        uint32 /* callbackGasLimit */,
        uint32 numWords,
        bytes memory
    ) external returns (uint256) {
        uint256 requestId = requestIdCounter++;
        consumer = msg.sender;
        emit RandomWordsRequested(requestId, msg.sender, 1, numWords);
        return requestId;
    }
}

contract DiceBetTest is Test {
    DiceBet public diceBet;
    MockVRFCoordinatorV2Plus public vrfCoordinator;
    uint256 public constant BET_AMOUNT = 0.01 ether;
    uint256 public constant REWARD_MULTIPLIER = 150;
    uint256 public constant MULTIPLIER_DENOMINATOR = 100;
    address public player = address(0x123);
    address public owner;

    function setUp() public {
        owner = address(this);
        vrfCoordinator = new MockVRFCoordinatorV2Plus();
        diceBet = new DiceBet(1);
        vm.store(
            address(diceBet),
            bytes32(uint256(1)),
            bytes32(uint256(uint160(address(vrfCoordinator))))
        );
    }

    function testRollDiceInvalidBetAmount() public {
        vm.deal(player, 1 ether);
        vm.expectRevert("Bet Amount not found");
        diceBet.rollDice{value: 0.02 ether}(3); // Wrong bet amount
    }

    function testRollDiceInvalidRollNumber() public {
        vm.deal(player, 1 ether);
        vm.expectRevert("Roll number must be between 1 and 6");
        diceBet.rollDice{value: BET_AMOUNT}(7); // Invalid roll number
    }

    function testDeposit() public {
        vm.deal(owner, 1 ether);
        vm.prank(owner);
        diceBet.deposit{value: 0.5 ether}();
        assertEq(
            address(diceBet).balance,
            0.5 ether,
            "Contract balance should be 0.5 ether"
        );
    }

    function testWithdrawInsufficientBalance() public {
        vm.deal(address(diceBet), 0.1 ether);
        vm.prank(owner);
        vm.expectRevert("Insufficient balance");
        diceBet.withdraw(0.2 ether);
    }
}
