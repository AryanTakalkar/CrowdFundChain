
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getMockCampaigns } from "@/utils/web3";
import Container from "@/components/ui/Container";
import Hero from "@/components/Hero";
import CampaignGrid from "@/components/Campaign/CampaignGrid";
import Header from "@/components/Header";
import BlurredCard from "@/components/ui/BlurredCard";

const Index = () => {
  const featuredCampaigns = getMockCampaigns().slice(0, 3);
  
  return (
    <div>
      <Header />
      
      <Hero />
      
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Container>
          <CampaignGrid
            campaigns={featuredCampaigns}
            title="Featured Campaigns"
            subtitle="Discover innovative projects that are making a real impact. Support creators and entrepreneurs building amazing solutions."
          />
          
          <div className="mt-10 text-center">
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full transition-all duration-300 hover:shadow-lg"
            >
              <span>View All Campaigns</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </motion.section>
      
      <motion.section
        className="py-20 bg-secondary/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Container>
          <div className="text-center mb-16">
            <motion.h2
              className="h2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Our blockchain-based crowdfunding platform makes it easy to fund
              and launch projects with complete transparency.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BlurredCard className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                Connect Your Wallet
              </h3>
              <p className="text-muted-foreground">
                Link your cryptocurrency wallet like MetaMask, WalletConnect,
                or Coinbase Wallet to get started.
              </p>
            </BlurredCard>
            
            <BlurredCard className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                Create or Fund Campaigns
              </h3>
              <p className="text-muted-foreground">
                Launch your own campaign or browse existing projects
                to support with cryptocurrency.
              </p>
            </BlurredCard>
            
            <BlurredCard className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                Track Progress
              </h3>
              <p className="text-muted-foreground">
                Monitor funding in real-time with complete transparency
                thanks to blockchain technology.
              </p>
            </BlurredCard>
          </div>
        </Container>
      </motion.section>
      
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Container>
          <div className="max-w-4xl mx-auto glass-card overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="font-display text-3xl font-bold mb-4">
                  Ready to Launch Your Project?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Create your campaign in minutes and start receiving funds
                  directly to your wallet with no intermediaries.
                </p>
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  <span>Start a Campaign</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="bg-primary/10 p-8 md:p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    100%
                  </div>
                  <p className="text-muted-foreground">
                    of funds go directly to creators
                    <br />
                    with smart contracts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </motion.section>
      
      <footer className="bg-secondary/30 py-12">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="font-display text-xl font-bold">
                CrowdFund<span className="text-primary">Chain</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Decentralized crowdfunding on the blockchain
              </p>
            </div>
            
            <div className="flex gap-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/campaigns" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Campaigns
              </Link>
              <Link to="/create" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Create
              </Link>
              <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Profile
              </Link>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CrowdFundChain. All rights reserved.
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Index;
