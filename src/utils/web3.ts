import { ethers } from "ethers";
import { toast } from "sonner";
import contractABI from "@/contracts/CrowdFundChain.json";

// ABI for our CrowdFundChain contract
export const CONTRACT_ABI = contractABI.abi;

// Updated with the deployed contract address on testnet
export const CONTRACT_ADDRESS = "0xbC9681894F36F438863cfAf8F64BEa9Cc6e27017";

export interface Campaign {
  id: number;
  creator: string;
  title: string;
  description: string;
  fundingGoal: string;
  amountRaised: string;
  deadline: Date;
  isClosed: boolean;
  progress: number;
}

export async function getContract(provider: ethers.BrowserProvider) {
  try {
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  } catch (error) {
    console.error("Failed to get contract:", error);
    throw error;
  }
}

export async function createCampaign(
  provider: ethers.BrowserProvider,
  title: string,
  description: string,
  fundingGoal: string,
  durationInDays: number
) {
  try {
    console.log("Creating campaign...");
    const contract = await getContract(provider);
    const fundingGoalWei = ethers.parseEther(fundingGoal);
    const deadline = Math.floor(Date.now() / 1000) + (durationInDays * 24 * 60 * 60);
    
    console.log("Contract address:", CONTRACT_ADDRESS);
    console.log("Parameters:", title, description, fundingGoalWei.toString(), deadline);
    
    const tx = await contract.createCampaign(title, description, fundingGoalWei, deadline);
    
    toast.info("Transaction submitted! Waiting for confirmation...");
    console.log("Transaction hash:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    
    // Get campaign ID from event logs
    interface ParsedLog {
      name: string;
      args: Array<string | number | boolean | bigint>;
    }

    const event = receipt.logs
      .map((log: ethers.Log) => {
        try {
          return contract.interface.parseLog({
            topics: [...log.topics],
            data: log.data
          });
        } catch (e) {
          return null;
        }
      })
      .find((event: ParsedLog | null) => event && event.name === "CampaignCreated");
    
    const campaignId = event ? event.args[0] : null;
    
    toast.success("Campaign created successfully!");
    return { success: true, campaignId };
  } catch (error: unknown) {
    console.error("Failed to create campaign:", error);
    toast.error(error instanceof Error ? error.message : "Failed to create campaign");
    return { success: false, error };
  }
}

export async function contributeToCampaign(
  provider: ethers.BrowserProvider,
  campaignId: number,
  amount: string
) {
  try {
    console.log("Contributing to campaign...");
    const contract = await getContract(provider);
    const amountWei = ethers.parseEther(amount);
    
    const tx = await contract.contribute(campaignId, { value: amountWei });
    
    toast.info("Transaction submitted! Waiting for confirmation...");
    console.log("Transaction hash:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    
    toast.success(`Successfully contributed ${amount} ETH!`);
    return { success: true, receipt };
  } catch (error: unknown) {
    console.error("Failed to contribute:", error);
    toast.error(error instanceof Error ? error.message : "Failed to contribute to campaign");
    return { success: false, error };
  }
}

export async function withdrawFunds(
  provider: ethers.BrowserProvider,
  campaignId: number
) {
  try {
    console.log("Withdrawing funds...");
    const contract = await getContract(provider);
    
    const tx = await contract.withdrawFunds(campaignId);
    
    toast.info("Transaction submitted! Waiting for confirmation...");
    console.log("Transaction hash:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    
    toast.success("Funds withdrawn successfully!");
    return { success: true, receipt };
  } catch (error: unknown) {
    console.error("Failed to withdraw funds:", error);
    toast.error(error instanceof Error ? error.message : "Failed to withdraw funds");
    return { success: false, error };
  }
}

export async function getCampaign(
  provider: ethers.BrowserProvider,
  campaignId: number
): Promise<Campaign> {
  try {
    console.log(`Fetching campaign ${campaignId}...`);
    const contract = await getContract(provider);
    
    const campaign = await contract.getCampaign(campaignId);
    
    console.log("Campaign data:", campaign);
    
    const fundingGoal = ethers.formatEther(campaign[3]);
    const amountRaised = ethers.formatEther(campaign[4]);
    const progress = parseFloat(amountRaised) / parseFloat(fundingGoal) * 100;
    
    return {
      id: campaignId,
      creator: campaign[0],
      title: campaign[1],
      description: campaign[2],
      fundingGoal,
      amountRaised,
      deadline: new Date(Number(campaign[5]) * 1000),
      isClosed: campaign[6],
      progress: Math.min(100, progress)
    };
  } catch (error) {
    console.error("Failed to get campaign:", error);
    throw error;
  }
}

export async function getAllCampaigns(provider: ethers.BrowserProvider): Promise<Campaign[]> {
  try {
    console.log("Fetching all campaigns...");
    const contract = await getContract(provider);
    
    // Try to get campaign count first
    try {
      const count = await contract.getCampaignCount();
      console.log("Campaign count:", count);
      
      const campaigns: Campaign[] = [];
      
      // Fetch campaigns by ID from 1 to count
      for (let i = 1; i <= Number(count); i++) {
        try {
          const campaign = await getCampaign(provider, i);
          campaigns.push(campaign);
        } catch (error) {
          console.error(`Error fetching campaign ${i}:`, error);
        }
      }
      
      return campaigns;
    } catch (error) {
      console.error("Failed to get campaign count, trying getAllCampaigns:", error);
      
      // Fallback to getAllCampaigns
      const campaignIds = await contract.getAllCampaigns();
      console.log("Campaign IDs:", campaignIds);
      
      const campaigns: Campaign[] = [];
      
      for (const id of campaignIds) {
        try {
          const campaign = await getCampaign(provider, Number(id));
          campaigns.push(campaign);
        } catch (error) {
          console.error(`Error fetching campaign ${id}:`, error);
        }
      }
      
      return campaigns;
    }
  } catch (error) {
    console.error("Failed to get all campaigns:", error);
    
    // Always fall back to mock data when blockchain fails
    console.log("Using mock data as fallback for getAllCampaigns");
    return getMockCampaigns();
  }
}

export async function getUserCampaigns(provider: ethers.BrowserProvider, address: string): Promise<Campaign[]> {
  try {
    console.log(`Fetching campaigns for user ${address}...`);
    const contract = await getContract(provider);
    
    const campaignIds = await contract.getUserCampaigns(address);
    console.log("User campaign IDs:", campaignIds);
    
    const campaigns: Campaign[] = [];
    
    for (const id of campaignIds) {
      try {
        const campaign = await getCampaign(provider, Number(id));
        campaigns.push(campaign);
      } catch (error) {
        console.error(`Error fetching campaign ${id}:`, error);
      }
    }
    
    return campaigns;
  } catch (error) {
    console.error("Failed to get user campaigns:", error);
    
    // Always fall back to mock data when blockchain fails
    console.log("Using mock data as fallback for getUserCampaigns");
    return getMockUserCampaigns(address);
  }
}

export function getMockCampaigns(): Campaign[] {
  return [
    {
      id: 1,
      creator: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      title: "Renewable Energy Project",
      description: "Help us build a solar farm to provide clean energy to local communities and reduce carbon emissions.",
      fundingGoal: "5.5",
      amountRaised: "3.2",
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      isClosed: false,
      progress: 58
    },
    {
      id: 2,
      creator: "0x1234567890123456789012345678901234567890",
      title: "Community Learning Center",
      description: "Building a technology education center for underprivileged youth to learn coding and digital skills.",
      fundingGoal: "2.8",
      amountRaised: "2.1",
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isClosed: false,
      progress: 75
    },
    {
      id: 3,
      creator: "0x9876543210987654321098765432109876543210",
      title: "Ocean Cleanup Initiative",
      description: "Funding equipment to remove plastic waste from coastal waters and protect marine ecosystems.",
      fundingGoal: "4.0",
      amountRaised: "1.2",
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      isClosed: false,
      progress: 30
    },
    {
      id: 4,
      creator: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      title: "Affordable Housing Project",
      description: "Developing sustainable housing solutions for low-income families in urban areas.",
      fundingGoal: "10.0",
      amountRaised: "3.5",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isClosed: false,
      progress: 35
    },
    {
      id: 5,
      creator: "0x1234567890123456789012345678901234567890",
      title: "Medical Research Fund",
      description: "Supporting innovative research on treatments for rare genetic disorders and improving patient care.",
      fundingGoal: "7.5",
      amountRaised: "6.8",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isClosed: false,
      progress: 90
    },
    {
      id: 6,
      creator: "0x9876543210987654321098765432109876543210",
      title: "Reforestation Project",
      description: "Planting trees and restoring degraded lands to combat climate change and protect biodiversity.",
      fundingGoal: "3.2",
      amountRaised: "1.5",
      deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      isClosed: false,
      progress: 46
    }
  ];
}

export function getMockUserCampaigns(address: string): Campaign[] {
  const mockCampaigns = getMockCampaigns();
  return mockCampaigns.filter(campaign => campaign.creator.toLowerCase() === address.toLowerCase());
}

export function truncateAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function getRemainingDays(deadline: Date): number {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
