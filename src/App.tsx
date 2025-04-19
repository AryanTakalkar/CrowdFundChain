import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { Web3Provider } from "@/context/Web3Context";
import { AnimatePresence } from "framer-motion";
import React, { lazy, Suspense } from "react";

const Index = lazy(() => import("./pages/Index"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const CampaignDetail = lazy(() => import("./pages/CampaignDetail"));
const CreateCampaign = lazy(() => import("./pages/CreateCampaign"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// AnimatePresence needs to be used with useLocation, which is a hook
// so we need to create a separate component for the routes
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Index />
            </Suspense>
          }
        />
        <Route
          path="/campaigns"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Campaigns />
            </Suspense>
          }
        />
        <Route
          path="/campaign/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <CampaignDetail />
            </Suspense>
          }
        />
        <Route
          path="/create"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <CreateCampaign />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <Web3Provider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </Web3Provider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;