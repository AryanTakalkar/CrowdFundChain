import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useWeb3 } from "@/context/Web3Context";
import { contributeToCampaign, getCampaign } from "@/utils/web3";
import Container from "@/components/ui/Container";
import CampaignDetail from "@/components/Campaign/CampaignDetail";
import Header from "@/components/Header";
import { toast } from "sonner";
import Comments from "@/components/Comments";
import ShareButtons from "@/components/ShareButtons";
import QnA from "@/components/QnA";

const CampaignDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isConnected, provider, account, refreshCampaigns } = useWeb3();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        if (provider) {
          const campaignData = await getCampaign(provider, parseInt(id));
          setCampaign(campaignData);
        } else {
          const { getMockCampaigns } = await import("@/utils/web3");
          const mockCampaigns = getMockCampaigns();
          const foundCampaign = mockCampaigns.find(c => c.id === parseInt(id));

          if (foundCampaign) {
            setCampaign(foundCampaign);
          } else {
            toast.error("Campaign not found");
          }
        }
      } catch (error) {
        console.error("Failed to fetch campaign:", error);
        toast.error("Failed to load campaign details");
        const { getMockCampaigns } = await import("@/utils/web3");
        const mockCampaigns = getMockCampaigns();
        const foundCampaign = mockCampaigns.find(c => c.id === parseInt(id));
        if (foundCampaign) {
          setCampaign(foundCampaign);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCampaign();
  }, [id, provider]);
  
  const handleContribute = async (amount: string) => {
    if (!isConnected || !provider) {
      toast.error("Please connect your wallet first");
      return false;
    }
    if (!campaign || !id) return false;
    try {
      const result = await contributeToCampaign(provider, parseInt(id), amount);
      if (result.success) {
        const updatedCampaign = await getCampaign(provider, parseInt(id));
        setCampaign(updatedCampaign);
        await refreshCampaigns();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Failed to contribute:", error);
      toast.error("Failed to process contribution");
      return false;
    }
  };

  const isCreator = campaign && account && campaign.creator.toLowerCase() === account.toLowerCase();

  return (
    <div>
      <Header />
      <motion.section className="py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Container>
          <div className="mb-10">
            <Link to="/campaigns" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to campaigns</span>
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : campaign ? (
            <>
              <CampaignDetail campaign={campaign} onContribute={handleContribute} isCreator={isCreator} />
              <div className="max-w-3xl w-full mt-6">
                <QnA campaignId={id} />
              </div>
              <div className="max-w-3xl w-full mt-6">
                <h3 className="text-lg font-semibold">Share this campaign:</h3>
                <ShareButtons campaignId={id} />
              </div>
              <div className="max-w-3xl w-full mt-6">
                <Comments campaignId={id} />  
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <h2 className="h2 mb-4">Campaign Not Found</h2>
              <p className="text-muted-foreground mb-8">The campaign you're looking for doesn't exist or has been removed.</p>
              <Link to="/campaigns" className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full transition-all duration-300 hover:shadow-lg">
                <span>View All Campaigns</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          )}
        </Container>
      </motion.section>
      <footer className="bg-secondary/30 py-12">
        <Container>
          <div className="text-center text-sm text-muted-foreground">© {new Date().getFullYear()} CrowdFundChain. All rights reserved.</div>
        </Container>
      </footer>
    </div>
  );
};

export default CampaignDetailPage;
