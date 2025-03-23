
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Campaign } from "@/utils/web3";
import { formatDate, getRemainingDays, truncateAddress } from "@/utils/web3";
import BlurredCard from "../ui/BlurredCard";

interface CampaignCardProps {
  campaign: Campaign;
  index?: number;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, index = 0 }) => {
  const remainingDays = getRemainingDays(campaign.deadline);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/campaign/${campaign.id}`}>
        <BlurredCard className="h-full flex flex-col">
          {/* Campaign Status Indicator */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
              {remainingDays > 0 ? `${remainingDays} days left` : "Ended"}
            </span>
            <span className="text-xs text-muted-foreground">
              By {truncateAddress(campaign.creator)}
            </span>
          </div>
          
          {/* Campaign Title */}
          <h3 className="font-display text-lg font-bold mb-2 line-clamp-1">
            {campaign.title}
          </h3>
          
          {/* Campaign Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
            {campaign.description}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${campaign.progress}%` }}
            />
          </div>
          
          {/* Funding Details */}
          <div className="flex justify-between text-sm mt-2">
            <div>
              <span className="font-semibold">{campaign.amountRaised} ETH</span>
              <span className="text-muted-foreground"> raised</span>
            </div>
            <div className="text-right">
              <span className="font-semibold">{Math.round(campaign.progress)}%</span>
              <span className="text-muted-foreground"> of {campaign.fundingGoal} ETH</span>
            </div>
          </div>
        </BlurredCard>
      </Link>
    </motion.div>
  );
};

export default CampaignCard;
