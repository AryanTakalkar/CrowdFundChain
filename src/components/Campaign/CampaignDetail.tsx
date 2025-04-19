
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, AlertCircle, ArrowUpRight } from "lucide-react";
import type { Campaign } from "@/utils/web3";
import { formatDate, getRemainingDays, truncateAddress } from "@/utils/web3";
import { useWeb3 } from "@/context/Web3Context";
import BlurredCard from "../ui/BlurredCard";
import { withdrawFunds } from "@/utils/web3";
import { toast } from "sonner";

interface CampaignDetailProps {
  campaign: Campaign;
  onContribute: (amount: string) => Promise<boolean>;
  isCreator?: boolean;
}

const CampaignDetail: React.FC<CampaignDetailProps> = ({
  campaign,
  onContribute,
  isCreator = false
}) => {
  const { isConnected, provider } = useWeb3();
  const [contributionAmount, setContributionAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  const remainingDays = getRemainingDays(campaign.deadline);
  const isFinished = remainingDays === 0 || campaign.isClosed;
  const canWithdraw = isCreator && isFinished && parseFloat(campaign.amountRaised) > 0;
  
  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) return;
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) return;
    
    setIsSubmitting(true);
    const success = await onContribute(contributionAmount);
    
    if (success) {
      setContributionAmount("");
    }
    
    setIsSubmitting(false);
  };
  
  const handleWithdraw = async () => {
    if (!isConnected || !provider || !isCreator) return;
    
    try {
      setIsWithdrawing(true);
      
      const result = await withdrawFunds(provider, campaign.id);
      
      if (result.success) {
        toast.success("Funds withdrawn successfully!");
      }
    } catch (error) {
      console.error("Failed to withdraw funds:", error);
      toast.error("Failed to withdraw funds");
    } finally {
      setIsWithdrawing(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <motion.div
        className="lg:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-8">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                {isFinished ? "Ended" : "Active Campaign"}
              </span>
              {isCreator && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                  You created this
                </span>
              )}
            </div>
            
            <h1 className="h2 mb-4">{campaign.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>By {truncateAddress(campaign.creator)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {isFinished
                    ? `Ended on ${formatDate(campaign.deadline)}`
                    : `${remainingDays} days left`}
                </span>
              </div>
            </div>
          </div>
          
          <BlurredCard animateOnHover={false}>
            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold">About this campaign</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {campaign.description}
              </p>
            </div>
          </BlurredCard>
          
          <BlurredCard animateOnHover={false}>
            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold">Campaign Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Creator</div>
                  <div className="flex items-center gap-2">
                    <span>{truncateAddress(campaign.creator)}</span>
                    <a
                      href={`https://etherscan.io/address/${campaign.creator}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Deadline</div>
                  <div>{formatDate(campaign.deadline)}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <div>
                    {isFinished
                      ? campaign.progress >= 100
                        ? "Successfully Funded"
                        : "Funding Ended"
                      : "Active"}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Funding Goal</div>
                  <div>{campaign.fundingGoal} ETH</div>
                </div>
              </div>
            </div>
          </BlurredCard>
        </div>
      </motion.div>
      
      <motion.div
        className="lg:col-span-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="sticky top-24">
          <BlurredCard animateOnHover={false}>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-semibold">{campaign.amountRaised} ETH</span>
                  <span>of {campaign.fundingGoal} ETH</span>
                </div>
                
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>{Math.round(campaign.progress)}% funded</span>
                  <span>
                    {isFinished ? "Campaign ended" : `${remainingDays} days left`}
                  </span>
                </div>
              </div>
              
              {!isFinished && (
                <form onSubmit={handleContribute} className="space-y-4">
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium mb-2"
                    >
                      Contribution Amount (ETH)
                    </label>
                    <input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.1"
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg transition-all hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={!isConnected || isSubmitting}
                  >
                    {isSubmitting
                      ? "Processing..."
                      : isConnected
                      ? "Contribute to Campaign"
                      : "Connect Wallet to Contribute"}
                  </button>
                  
                  {!isConnected && (
                    <div className="flex items-start gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        You need to connect your wallet first to contribute to this campaign.
                      </p>
                    </div>
                  )}
                </form>
              )}
              
              {isFinished && !canWithdraw && (
                <div className="px-4 py-3 bg-secondary/50 rounded-lg text-center">
                  <p className="font-medium">This campaign has ended</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    The funding period for this campaign is over.
                  </p>
                </div>
              )}
              
              {canWithdraw && (
                <div className="space-y-4">
                  <div className="px-4 py-3 bg-primary/10 rounded-lg">
                    <p className="font-medium">Campaign Completed</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      As the creator, you can now withdraw the funds raised.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleWithdraw}
                    className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg transition-all hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? "Processing..." : "Withdraw Funds"}
                  </button>
                </div>
              )}
            </div>
          </BlurredCard>
        </div>
      </motion.div>
    </div>
  );
};

export default CampaignDetail;
