
import React from "react";
import { motion } from "framer-motion";
import { useWeb3 } from "@/context/Web3Context";
import { truncateAddress } from "@/utils/web3";
import CampaignGrid from "./Campaign/CampaignGrid";
import type { Campaign } from "@/utils/web3";
import BlurredCard from "./ui/BlurredCard";
import { ExternalLink, Wallet, Coins } from "lucide-react";

interface UserProfileProps {
  userCampaigns: Campaign[];
  contributedCampaigns: Campaign[];
}

const UserProfile: React.FC<UserProfileProps> = ({
  userCampaigns,
  contributedCampaigns,
}) => {
  const { account, balance, network, isConnected } = useWeb3();
  
  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-16"
        >
          <h2 className="h2 mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-8">
            Please connect your wallet to view your profile and campaigns.
          </p>
          <Wallet className="h-16 w-16 mx-auto text-muted-foreground" />
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BlurredCard className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Wallet className="h-10 w-10" />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-display text-2xl font-bold mb-2">
                {truncateAddress(account || "")}
              </h2>
              
              <a
                href={`https://etherscan.io/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary"
              >
                <span>View on Etherscan</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 bg-secondary/30 p-4 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Balance</span>
                  </div>
                  <div className="font-medium mt-1">
                    {balance ? `${Number(balance).toFixed(4)} ETH` : "0 ETH"}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Network</div>
                  <div className="font-medium mt-1 capitalize">
                    {network || "Not connected"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BlurredCard>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="h3 mb-8">Your Campaigns</h2>
        <CampaignGrid campaigns={userCampaigns} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="h3 mb-8">Campaigns You've Supported</h2>
        <CampaignGrid campaigns={contributedCampaigns} />
      </motion.div>
    </div>
  );
};

export default UserProfile;
