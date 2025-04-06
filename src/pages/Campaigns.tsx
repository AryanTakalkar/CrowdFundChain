
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useWeb3 } from "@/context/Web3Context";
import Container from "@/components/ui/Container";
import CampaignGrid from "@/components/Campaign/CampaignGrid";
import Header from "@/components/Header";
import { toast } from "sonner";

const Campaigns = () => {
  const { campaigns, isConnected, refreshCampaigns, isLoadingCampaigns } = useWeb3();
  const [refreshAttempted, setRefreshAttempted] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      if (isConnected) {
        try {
          await refreshCampaigns();
        } catch (error) {
          console.error("Error refreshing campaigns:", error);
          toast.error("Failed to load campaigns. Showing mock data instead.");
        } finally {
          setRefreshAttempted(true);
        }
      }
    }
    
    fetchData();
  }, [isConnected, refreshCampaigns]);
  
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
          <div className="text-center mb-16">
            <motion.h1
              className="h1 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Explore Campaigns
            </motion.h1>
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Discover innovative projects seeking funding and support creators
              making a difference. All transactions are secure and transparent on the blockchain.
            </motion.p>
          </div>
          
          {isLoadingCampaigns ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : campaigns.length > 0 ? (
            <CampaignGrid campaigns={campaigns} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {refreshAttempted ? "No campaigns found. Be the first to create one!" : "Loading campaigns..."}
              </p>
            </div>
          )}
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

export default Campaigns;
