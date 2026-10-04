import React, { useState } from "react";
import { X, Copy } from "lucide-react";
import useOrgStore from "../../stores/useOrgStore";

const GitHubWebhookModal = ({ isOpen, onClose }) => {
  const { org } = useOrgStore();
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const webhookUrl = org?.id
    ? `https://api.lastgood.space/webhooks/github/${org.id}`
    : "";

  const handleCopy = () => {
    if (!webhookUrl) return;
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-[#0b0f0d]/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-card border border-white/10 rounded-xl shadow-lg p-8 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">GitHub Webhook URL</h2>
        <p className="text-text-secondary mb-6">
          Add this webhook URL to your GitHub repository to receive events.
        </p>
        <div className="flex items-center gap-4 bg-bg-primary border border-border rounded-lg p-4">
          <input
            type="text"
            readOnly
            value={org?.id ? webhookUrl : "Loading organization details..."}
            className="flex-1 bg-transparent font-mono text-sm text-text-secondary focus:outline-none"
          />
          <button
            onClick={handleCopy}
            disabled={!org?.id}
            className="flex items-center gap-2 px-3 py-1.5 bg-bg-tertiary hover:bg-bg-primary border border-border rounded-lg text-text-primary text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy size={16} />
            {isCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GitHubWebhookModal;
