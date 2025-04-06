
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeb3 } from "@/context/Web3Context";
import { Wallet, ChevronDown, LogOut, ExternalLink } from "lucide-react";
import { truncateAddress } from "@/utils/web3";

const WalletConnect: React.FC = () => {
  const { account, isConnected, isConnecting, balance, network, connectWallet, disconnectWallet } = useWeb3();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleConnectWallet = async (provider: "metamask" | "walletconnect" | "coinbase") => {
    await connectWallet(provider);
    setIsDropdownOpen(false);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const walletProviders = [
    { name: "MetaMask", type: "metamask" as const },
    { name: "WalletConnect", type: "walletconnect" as const },
    { name: "Coinbase Wallet", type: "coinbase" as const },
  ];

  return (
    <div className="relative">
      {isConnected ? (
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 glass py-2 px-4 rounded-full transition-all duration-300 hover:ring-2 hover:ring-primary/20"
        >
          <Wallet className="h-4 w-4" />
          <span className="hidden md:inline">{truncateAddress(account!)}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>
      ) : (
        <button
          onClick={toggleDropdown}
          className="glass py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300 hover:ring-2 hover:ring-primary/20"
          disabled={isConnecting}
        >
          <Wallet className="h-4 w-4" />
          <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
        </button>
      )}

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 rounded-xl glass shadow-lg z-50 overflow-hidden"
          >
            {isConnected ? (
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  <div className="text-sm font-medium">Connected Account</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="truncate">{account}</span>
                    <a
                      href={`https://etherscan.io/address/${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-full hover:bg-primary/10 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Balance</div>
                    <div className="font-medium">{balance ? `${Number(balance).toFixed(4)} ETH` : "..."}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Network</div>
                    <div className="font-medium capitalize">{network || "..."}</div>
                  </div>
                </div>

                <button
                  onClick={handleDisconnect}
                  className="w-full mt-2 py-2 rounded-lg bg-secondary/80 hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <div className="p-4">
                <div className="mb-3 text-sm">Connect with:</div>
                <div className="space-y-2">
                  {walletProviders.map((provider) => (
                    <button
                      key={provider.type}
                      onClick={() => handleConnectWallet(provider.type)}
                      className="w-full py-2 px-4 rounded-lg bg-secondary/80 hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                      disabled={isConnecting}
                    >
                      <span>{provider.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletConnect;
