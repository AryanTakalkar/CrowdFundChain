import React, { createContext, useContext, useEffect, useState,useCallback } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import { getAllCampaigns, getUserCampaigns, getCampaign, Campaign } from "@/utils/web3";


type Web3ContextType = {
  account: string | null;
  network: string | null;
  balance: string | null;
  provider: ethers.BrowserProvider | null;
  isConnecting: boolean;
  isConnected: boolean;
  campaigns: Campaign[];
  userCampaigns: Campaign[];
  isLoadingCampaigns: boolean;
  refreshCampaigns: () => Promise<void>;
  connectWallet: (providerType: "metamask" | "walletconnect" | "coinbase") => Promise<void>;
  disconnectWallet: () => void;
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [userCampaigns, setUserCampaigns] = useState<Campaign[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      const savedAccount = localStorage.getItem("connectedAccount");
      if (savedAccount && window.ethereum) {
        try {
          setIsConnecting(true);
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await browserProvider.listAccounts();
          
          if (accounts.length > 0 && accounts[0].address.toLowerCase() === savedAccount.toLowerCase()) {
            setAccount(accounts[0].address);
            setIsConnected(true);
            setProvider(browserProvider);
            
            const network = await browserProvider.getNetwork();
            setNetwork(network.name);
            
            const balance = await browserProvider.getBalance(accounts[0].address);
            setBalance(ethers.formatEther(balance));
            
            loadCampaigns(browserProvider, accounts[0].address);
          } else {
            localStorage.removeItem("connectedAccount");
          }
        } catch (error) {
          console.error("Failed to reconnect wallet:", error);
          localStorage.removeItem("connectedAccount");
        } finally {
          setIsConnecting(false);
        }
      }
    };
    
    checkConnection();
  }, []);

  useEffect(() => {
    if (window.ethereum && isConnected) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
          localStorage.setItem("connectedAccount", accounts[0]);
          updateBalance(accounts[0]);
          
          if (provider) {
            loadCampaigns(provider, accounts[0]);
          }
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, [account, isConnected, provider]);

  const updateBalance = async (address: string) => {
    if (provider) {
      try {
        const balance = await provider.getBalance(address);
        setBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    }
  };
  
  const loadCampaigns = async (provider: ethers.BrowserProvider, address: string) => {
    setIsLoadingCampaigns(true);
    try {
      console.log("Loading all campaigns...");
      const allCampaigns = await getAllCampaigns(provider);
      setCampaigns(allCampaigns);
      
      console.log("Loading user campaigns...");
      const userCampaigns = await getUserCampaigns(provider, address);
      setUserCampaigns(userCampaigns);
      
      console.log("Campaigns loaded successfully:", {
        allCampaigns: allCampaigns.length,
        userCampaigns: userCampaigns.length
      });
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      
      console.log("Using mock data as fallback");
      const { getMockCampaigns, getMockUserCampaigns } = await import("@/utils/web3");
      setCampaigns(getMockCampaigns());
      setUserCampaigns(getMockUserCampaigns(address));
      
      toast.error("Failed to load campaigns from blockchain. Showing mock data instead.");
    } finally {
      setIsLoadingCampaigns(false);
    }
  };
  
  // const refreshCampaigns = async () => {
  //   if (provider && account) {
  //     console.log("Refreshing campaigns for account:", account);
  //     await loadCampaigns(provider, account);
  //   } else {
  //     console.warn("Cannot refresh campaigns: no provider or account");
  //   }
  // };
  const refreshCampaigns = useCallback(async () => {
    if (provider && account) {
      console.log("Refreshing campaigns for account:", account);
      await loadCampaigns(provider, account);
    } else {
      console.warn("Cannot refresh campaigns: no provider or account");
    }
  }, [provider, account]);

  const connectWallet = async (providerType: "metamask" | "walletconnect" | "coinbase") => {
    setIsConnecting(true);
    
    try {
      if (!window.ethereum) {
        toast.error("No wallet found! Please install MetaMask or another web3 wallet.");
        return;
      }
      
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      
      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }
      
      setAccount(accounts[0]);
      setIsConnected(true);
      setProvider(browserProvider);
      localStorage.setItem("connectedAccount", accounts[0]);
      
      const network = await browserProvider.getNetwork();
      setNetwork(network.name);
      
      const balance = await browserProvider.getBalance(accounts[0]);
      setBalance(ethers.formatEther(balance));
      
      await loadCampaigns(browserProvider, accounts[0]);
      
      toast.success("Wallet connected successfully!");
    } catch (error: unknown) {
      console.error("Error connecting wallet:", error);
      toast.error(error instanceof Error ? error.message : "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setNetwork(null);
    setBalance(null);
    setIsConnected(false);
    setProvider(null);
    setCampaigns([]);
    setUserCampaigns([]);
    localStorage.removeItem("connectedAccount");
    toast.info("Wallet disconnected");
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        network,
        balance,
        provider,
        isConnecting,
        isConnected,
        campaigns,
        userCampaigns,
        isLoadingCampaigns,
        refreshCampaigns,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
