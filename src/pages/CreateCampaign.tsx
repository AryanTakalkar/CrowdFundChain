
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createCampaign } from "@/utils/web3";
import { useWeb3 } from "@/context/Web3Context";
import Container from "@/components/ui/Container";
import CreateCampaignForm from "@/components/Campaign/CreateCampaign";
import Header from "@/components/Header";
import { toast } from "sonner";

const CreateCampaignPage = () => {
  const { isConnected, provider, refreshCampaigns } = useWeb3();
  const navigate = useNavigate();
  
  const handleCreateCampaign = async (
    title: string,
    description: string,
    fundingGoal: string,
    duration: number
  ) => {
    if (!isConnected || !provider) {
      toast.error("Please connect your wallet first");
      return false;
    }
    
    try {
      toast.info("Submitting transaction to blockchain...");
      const result = await createCampaign(provider, title, description, fundingGoal, duration);
      
      if (result.success) {
        toast.success("Campaign created successfully!");
        
        // Refresh campaigns list
        await refreshCampaigns();
        
        // Navigate to campaigns page after a short delay
        setTimeout(() => {
          navigate("/campaigns");
        }, 1500);
        
        return true;
      } else {
        toast.error((result.error as Error)?.message || "Failed to create campaign");
        return false;
      }
    } catch (error: unknown) {
      console.error("Failed to create campaign:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create campaign");
      return false;
    }
  };
  
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
              Create a Campaign
            </motion.h1>
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Launch your project and start receiving funding directly to your wallet.
              Set your funding goal, deadline, and share your vision with potential supporters.
            </motion.p>
          </div>
          
          <CreateCampaignForm onSubmit={handleCreateCampaign} />
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

export default CreateCampaignPage;
