import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import Image from 'next/image';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { contractABI, contractAddress } from '@/utils/constants';

const GameScreen: React.FC = () => {
  const { logout, ready } = usePrivy();
  const { wallets } = useWallets();
  const [isRolling, setIsRolling] = useState(false);
  const [diceFace, setDiceFace] = useState('\u2680');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProcessingBet, setIsProcessingBet] = useState(false);
  const [betResult, setBetResult] = useState<string | null>(null);

  const diceFaces = ['\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685'];

  // Simulate local dice roll animation
  const handleRoll = () => {
    if (isRolling || !ready || wallets.length === 0) return;

    setIsRolling(true);
    setBetResult(null);

    let counter = 0;
    const rollInterval = setInterval(() => {
      setDiceFace(diceFaces[Math.floor(Math.random() * 6)]);
      if (++counter >= 10) {
        clearInterval(rollInterval);
        setIsRolling(false);
      }
    }, 100);
  };

  // Handle Place Bet and contract interaction
  const handlePlaceBet = async () => {
    if (isRolling || isProcessingBet || !ready || wallets.length === 0) return;

    setIsProcessingBet(true);
    setBetResult(null);

    try {
      // Get the embedded wallet from Privy
      const wallet = wallets[0];
      const provider = new ethers.BrowserProvider(await wallet.getEthereumProvider());
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Map diceFace to diceNumber (1-6)
      const diceNumber = diceFaces.indexOf(diceFace) + 1;

      // Call rollDice on the contract with 0.01 ETH and 20 Gwei gas price
      const tx = await contract.rollDice(diceNumber, {
        value: ethers.parseEther("0.01"),
      });
      await tx.wait();
      toast.success("Dice rolled on-chain with 0.01 ETH!");

      // Start polling getBet
      await pollBetStatus(contract);
    } catch (error) {
      console.error("Error processing bet:", error);
      toast.error("Failed to place bet on-chain");
      setIsProcessingBet(false);
    }
  };

  // Poll getBet until isRolling is false
  const pollBetStatus = async (contract: ethers.Contract) => {
    const checkBet = async () => {
      try {
        const [rollNumber, result, isRolling] = await contract.getBet();
        if (isRolling) {
          // Continue polling if still rolling
          setTimeout(checkBet, 10000); // 10 seconds gap
        } else {
          // Stop polling and process result
          setDiceFace(diceFaces[0]); // Update dice face to final result
          if (rollNumber === result) {
            setBetResult("You won!");
            toast.success("You won the bet!");
          } else {
            setBetResult("Contract won!");
            toast.info("Contract won the bet!");
          }
          setIsProcessingBet(false);
        }
      } catch (error) {
        console.error("Error fetching bet status:", error);
        toast.error("Failed to fetch bet status");
        setIsProcessingBet(false);
      }
    };

    await checkBet();
  };

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="text-center relative w-full">
      {ready && !isLoggingOut && !isProcessingBet && (
        <button
          className="absolute top-0 right-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}

      <h1 className="text-4xl md:text-6xl font-bold mb-8">Roll the Dice</h1>

      <div className="flex flex-col items-center">
        <div
          className="w-24 h-24 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4 cursor-pointer"
          onClick={handleRoll}
        >
          <span className="text-4xl">{diceFace}</span>
        </div>
        {(isLoggingOut || isProcessingBet) && (
          <div className="mb-4">
            <Image
              src="/dice_loading.gif"
              alt={isLoggingOut ? "Logging out" : "Processing bet"}
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
        )}
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition text-lg disabled:bg-gray-400"
          onClick={handlePlaceBet}
          disabled={isRolling || isProcessingBet}
        >
          Place Bet
        </button>
        {betResult && (
          <p className="text-xl font-semibold mt-4">{betResult}</p>
        )}
      </div>
    </div>
  );
};

export default GameScreen;