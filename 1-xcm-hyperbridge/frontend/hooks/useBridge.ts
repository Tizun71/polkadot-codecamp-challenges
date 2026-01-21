"use client";

import { ethers } from "ethers";
import { useMetaMask } from "@/hooks/useWallet";
import TOKEN_BRIDGE from "../abis/TokenBridge.json";
import { useTracking } from "./useTracking";

export function useBridge() {
  const { switchChain } = useMetaMask();
  const { trackStatus } = useTracking();
  const bridgeTokens = async ({
    token,
    symbol,
    amount,
    destChainId,
  }: {
    token: string;
    symbol: string;
    amount: string;
    destChainId: number;
  }) => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      await switchChain("0x61");
      const TOKEN_BRIDGE_CONTRACT_ADDRESS = "0x94B6f130A401B8EB2deEC2e594D5e47B598a0e77";
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          TOKEN_BRIDGE_CONTRACT_ADDRESS,
          TOKEN_BRIDGE.abi,
          signer
        );


        const recipient = await signer.getAddress();
        const amountParsed = ethers.parseUnits(amount, 18);
        const destChain = ethers.toUtf8Bytes(`EVM-${destChainId}`);

        const tx = await contract.bridgeTokens(
          token,
          symbol,
          amountParsed,
          recipient,
          destChain,
          { value: 0 }
        );

        const receipt = await tx.wait();

      const assetTeleportedAbi = [
        "event AssetTeleported(bytes32 to, string dest, uint256 amount, bytes32 commitment, address indexed from, bytes32 indexed assetId, bool redeem)"
      ];
      const iface = new ethers.Interface(assetTeleportedAbi);

      let commitment: string | null = null;

      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed && parsed.name === "AssetTeleported") {
            commitment = parsed.args.commitment;
            break;
          }
        } catch (e) {
        }
      }

      console.log("Bridge successful:", tx.hash, "Commitment:", commitment);
      return { txHash: tx.hash, commitment: commitment as `0x${string}` };
    } catch (error) {
      console.error("Bridge failed:", error);
      throw error;
    }
  };

  const approveToken = async ({
    token,
    amount
  }: {
    token: string;
    amount: string;
  }) => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("Approving", amount, "of token", token);
      const erc20 = new ethers.Contract(
        token,
        ["function approve(address spender, uint256 amount) public returns (bool)"],
        signer
      );
      console.log("ERC20 contract:", erc20);
      const spender = "0x94B6f130A401B8EB2deEC2e594D5e47B598a0e77";
      const amountParsed = ethers.parseUnits(amount, 18);
      const tx = await erc20.approve(spender, amountParsed);
      await tx.wait();
      console.log("Approve successful:", tx.hash);
      return tx.hash;
    } catch (error) {
      console.error("Approve failed:", error);
      throw error;
    }
  };

  return { bridgeTokens, approveToken };
}
