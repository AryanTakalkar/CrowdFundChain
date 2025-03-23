
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useWeb3 } from "@/context/Web3Context";
import BlurredCard from "../ui/BlurredCard";

interface CreateCampaignProps {
  onSubmit: (
    title: string,
    description: string,
    fundingGoal: string,
    duration: number
  ) => Promise<boolean>;
}

const CreateCampaign: React.FC<CreateCampaignProps> = ({ onSubmit }) => {
  const { isConnected } = useWeb3();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [duration, setDuration] = useState("30");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) return;
    
    setIsSubmitting(true);
    const success = await onSubmit(
      title,
      description,
      fundingGoal,
      parseInt(duration)
    );
    
    if (success) {
      setTitle("");
      setDescription("");
      setFundingGoal("");
      setDuration("30");
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BlurredCard animateOnHover={false} className="p-8">
          <h2 className="h3 mb-6">Create a New Campaign</h2>
          
          {!isConnected && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
              <AlertCircle className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Wallet not connected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please connect your wallet to create a new campaign.
                </p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium mb-2"
              >
                Campaign Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={!isConnected}
              />
            </div>
            
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
              >
                Campaign Description
              </label>
              <textarea
                id="description"
                rows={6}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                placeholder="Describe your campaign in detail"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={!isConnected}
              />
            </div>
            
            <div>
              <label
                htmlFor="fundingGoal"
                className="block text-sm font-medium mb-2"
              >
                Funding Goal (ETH)
              </label>
              <input
                id="fundingGoal"
                type="number"
                step="0.01"
                min="0.01"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="0.5"
                value={fundingGoal}
                onChange={(e) => setFundingGoal(e.target.value)}
                required
                disabled={!isConnected}
              />
            </div>
            
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium mb-2"
              >
                Campaign Duration (Days)
              </label>
              <select
                id="duration"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                disabled={!isConnected}
              >
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none"
              disabled={!isConnected || isSubmitting}
            >
              {isSubmitting
                ? "Creating Campaign..."
                : "Create Campaign"}
            </button>
          </form>
        </BlurredCard>
      </motion.div>
    </div>
  );
};

export default CreateCampaign;
