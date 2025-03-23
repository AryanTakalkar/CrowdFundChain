
import React from "react";
import { motion } from "framer-motion";
import CampaignCard from "./CampaignCard";
import type { Campaign } from "@/utils/web3";

interface CampaignGridProps {
  campaigns: Campaign[];
  title?: string;
  subtitle?: string;
}

const CampaignGrid: React.FC<CampaignGridProps> = ({
  campaigns,
  title,
  subtitle,
}) => {
  return (
    <div>
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <motion.h2
              className="h2 mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign, index) => (
          <CampaignCard key={campaign.id} campaign={campaign} index={index} />
        ))}
      </div>

      {campaigns.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-medium mb-2">No campaigns found</h3>
          <p className="text-muted-foreground">
            There are no campaigns available at the moment.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CampaignGrid;
