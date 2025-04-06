import React from "react";
import { toast } from "sonner"; // ✅ Toast for notifications
import { Facebook, Twitter, Copy } from "lucide-react"; // ✅ Icons

const ShareButtons = ({ campaignId }) => {
    const campaignUrl = `${window.location.origin}/campaigns/${campaignId}`;

    // ✅ Function to Copy Link
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(campaignUrl);
            toast.success("Link copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy link.");
            console.error("Clipboard Copy Error:", error);
        }
    };

    return (
        <div className="flex items-center gap-4 mt-4">
            {/* ✅ Facebook Share - Opens in New Tab */}
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700 transition"
            >
                <Facebook size={16} />
                Facebook
            </a>

            {/* ✅ Twitter Share - Fixed Refresh Issue */}
            <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(campaignUrl)}&text=Check out this amazing campaign!`}
                target="_blank" // 🔥 Fixes the page refresh issue!
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-400 text-white rounded flex items-center gap-2 hover:bg-blue-500 transition"
            >
                <Twitter size={16} />
                Twitter
            </a>

            {/* ✅ Copy Link Button */}
            <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-gray-700 text-white rounded flex items-center gap-2 hover:bg-gray-800 transition"
            >
                <Copy size={16} />
                Copy Link
            </button>
        </div>
    );
};

export default ShareButtons;
