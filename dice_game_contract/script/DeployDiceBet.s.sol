// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DiceBet.sol";

contract DeployDiceBet is Script {
    // Replace with your actual Chainlink VRF subscription ID
    uint256 public constant SUBSCRIPTION_ID =
        58131204632146151347689806638220581210853296334608718844906017656813777582475;

    function run() external {
        // You can set private key in .env file like PRIVATE_KEY=...
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        DiceBet diceBet = new DiceBet(SUBSCRIPTION_ID);

        console.log("DiceBet deployed at:", address(diceBet));

        vm.stopBroadcast();
    }
}
