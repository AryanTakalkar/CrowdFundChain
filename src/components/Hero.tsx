
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "./ui/Container";
import BlurredCard from "./ui/BlurredCard";

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-20 pb-32 md:pt-24 md:pb-40">
      {/* Background decorations */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-70 animate-float" />
      <div className="absolute top-32 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-70 animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute -bottom-40 left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70 animate-float" style={{ animationDelay: "2s" }} />

      <Container className="relative z-10">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
              Secure Blockchain Crowdfunding
            </span>
          </motion.div>

          <motion.h1
            className="h1 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Transparent Crowdfunding
            <br />
            <span className="text-primary">Powered by Blockchain</span>
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Create, fund, and track projects transparently on the blockchain.
            No intermediaries, lower fees, and full visibility of fund allocation.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to="/campaigns"
              className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            >
              <span>Explore Campaigns</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/create"
              className="w-full sm:w-auto px-8 py-3 glass rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg"
            >
              Start Funding
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <BlurredCard className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold mb-2">Secure & Transparent</h3>
            <p className="text-muted-foreground">
              All transactions are recorded on the blockchain, ensuring
              transparency and security for every contribution.
            </p>
          </BlurredCard>

          <BlurredCard className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 12a5 5 0 0 0-5-5 4.9 4.9 0 0 0-2.1.48" />
                <path d="M17 5V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2" />
                <path d="M10 16v-3" />
                <path d="M14 13v3" />
                <path d="M10 5.3V3" />
                <path d="M14 3v2.3" />
                <path d="M5 8a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4" />
                <circle cx="12" cy="17" r="2" />
                <path d="M6 17h4" />
                <path d="M14 17h4" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold mb-2">No Intermediaries</h3>
            <p className="text-muted-foreground">
              Connect directly with project creators. Smart contracts
              automate the funding process without third parties.
            </p>
          </BlurredCard>

          <BlurredCard className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold mb-2">Real-time Updates</h3>
            <p className="text-muted-foreground">
              Track funding progress in real time. Get instant confirmation
              when your contribution is processed.
            </p>
          </BlurredCard>
        </motion.div>
      </Container>
    </div>
  );
};

export default Hero;
