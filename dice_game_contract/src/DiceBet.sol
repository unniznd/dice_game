// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract DiceBet is VRFConsumerBaseV2Plus {
    // VRF Configuration
    uint256 public s_subscriptionId;
    address public vrfCoordinator = 0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B;
    bytes32 public s_keyHash =
        0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
    uint32 public callbackGasLimit = 80000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 1;

    uint256 private s_totalRolling = 0;

    struct Bet {
        uint256 rollNumber;
        uint256 result;
        bool isRolling;
    }

    mapping(address => Bet) private s_bets;
    mapping(uint256 => address) private s_requestIdToRoller;

    uint256 constant BET_AMOUNT = 0.01 ether;
    uint256 constant REWARD_MULTIPLER = 150;
    uint256 constant MULTIPLIER_DENOMINATOR = 100;

    event DiceRolled(address roller, uint256 requestId);
    event DiceLanded(address roller, uint256 rollNumber, uint256 result);

    constructor(uint256 subscriptionId) VRFConsumerBaseV2Plus(vrfCoordinator) {
        s_subscriptionId = subscriptionId;
    }

    function rollDice(
        uint256 _rollNumber
    ) public payable returns (uint256 requestId) {
        require(
            _rollNumber >= 1 && _rollNumber <= 6,
            "Roll number must be between 1 and 6"
        );
        require(msg.value == BET_AMOUNT, "Bet Amount not found");
        require(!s_bets[msg.sender].isRolling, "Rolling in progress");

        s_totalRolling++;
        uint256 reward = s_totalRolling *
            ((BET_AMOUNT * REWARD_MULTIPLER) / MULTIPLIER_DENOMINATOR);
        require(
            address(this).balance > reward,
            "Insufficent balance in contract"
        );

        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: s_keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );

        s_requestIdToRoller[requestId] = msg.sender;
        s_bets[msg.sender] = Bet({
            rollNumber: _rollNumber,
            result: 0,
            isRolling: true
        });

        emit DiceRolled({roller: msg.sender, requestId: _rollNumber});
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) internal override {
        uint256 d6Value = (randomWords[0] % 6) + 1;
        s_bets[s_requestIdToRoller[requestId]].result = d6Value;
        s_bets[s_requestIdToRoller[requestId]].isRolling = false;
        s_totalRolling--;

        uint256 _rollNumber = s_bets[s_requestIdToRoller[requestId]].rollNumber;

        if (_rollNumber == d6Value) {
            uint256 reward = (BET_AMOUNT * REWARD_MULTIPLER) /
                MULTIPLIER_DENOMINATOR;
            payable(msg.sender).transfer(reward);
        }

        emit DiceLanded({
            roller: s_requestIdToRoller[requestId],
            rollNumber: _rollNumber,
            result: d6Value
        });
    }

    function deposit() public payable onlyOwner {
        require(msg.value > 0, "Require non zero ETH");
    }
    function withdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(owner()).transfer(amount);
    }

    function getBet()
        public
        view
        returns (uint256 rollNumber, uint256 result, bool isRolling)
    {
        return (
            s_bets[msg.sender].rollNumber,
            s_bets[msg.sender].result,
            s_bets[msg.sender].isRolling
        );
    }
}
