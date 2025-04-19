
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "@/context/Web3Context";
import Container from "@/components/ui/Container";
import CampaignGrid from "@/components/Campaign/CampaignGrid";
import Header from "@/components/Header";
import BlurredCard from "@/components/ui/BlurredCard";
import { Button } from "@/components/ui/button";
import { Wallet, Plus } from "lucide-react";

const Profile = () => {
  const { isConnected, userCampaigns, refreshCampaigns, account, balance, network } = useWeb3();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isConnected) {
      refreshCampaigns();
    }
  }, [isConnected, refreshCampaigns]);
  
  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      // Small delay to allow context to initialize
      const timer = setTimeout(() => {
        navigate("/");
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, navigate]);
  
  if (!isConnected) {
    return null;
  }
  
  return (
    <div>
      <Header />
      
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Container>
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BlurredCard className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h1 className="h3 mb-2">My Profile</h1>
                  <div className="flex flex-col gap-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Wallet Address</div>
                      <div className="font-mono text-sm break-all">{account}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Balance</div>
                        <div className="font-medium">{balance ? `${Number(balance).toFixed(4)} ETH` : "..."}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Network</div>
                        <div className="font-medium capitalize">{network || "..."}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center md:items-end gap-4">
                  <Button
                    onClick={() => navigate("/create")}
                    className="w-full md:w-auto flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create New Campaign
                  </Button>
                </div>
              </div>
            </BlurredCard>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="h3 mb-6">My Campaigns</h2>
            
            {userCampaigns.length > 0 ? (
              <CampaignGrid campaigns={userCampaigns} />
            ) : (
              <BlurredCard className="p-8 text-center">
                <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">No campaigns yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't created any crowdfunding campaigns yet.
                </p>
                <Button
                  onClick={() => navigate("/create")}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create New Campaign
                </Button>
              </BlurredCard>
            )}
          </motion.div>
        </Container>
      </motion.section>
      
      <footer className="bg-secondary/30 py-12">
        <Container>
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CrowdFundChain. All rights reserved.
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Profile;
