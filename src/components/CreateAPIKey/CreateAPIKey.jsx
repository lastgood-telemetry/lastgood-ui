import React, { useState } from "react";
import { Key, Shield } from "lucide-react";
import { createAPIKey } from "../../service/api-key";

const CreateAPIKey = ({ onKeyCreated }) => {
  const [keyName, setKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateKey = async (e) => {
    e.preventDefault();
    if (!keyName.trim()) {
      setError("Key name is required.");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const newKey = await createAPIKey(keyName);
      onKeyCreated(newKey);
    } catch (err) {
      setError("Failed to create API key. Please try again.");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-gradient-card border border-white/10 rounded-xl overflow-hidden mb-8 shadow-lg">
      <div className="p-6 border-b border-white/10 bg-[#0b0f0d]/20">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Shield size={20} className="text-accent" />
          API Configuration
        </h2>
      </div>
      <div className="p-6 space-y-6">
        <p className="text-text-secondary text-sm">
          No API key found. Create one to start collecting data.
        </p>
        <form onSubmit={handleCreateKey} className="space-y-4">
          <div>
            <label
              htmlFor="keyName"
              className="block text-sm font-medium text-text-muted mb-2"
            >
              Key Name
            </label>
            <input
              id="keyName"
              type="text"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="e.g., Production Key"
              className="w-full bg-bg-primary border border-border rounded-lg px-4 py-3 font-mono text-sm text-text-secondary focus:ring-accent focus:border-accent"
              disabled={isCreating}
            />
          </div>
          {error && <p className="text-status-error text-sm">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCreating}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover border border-transparent rounded-lg text-[#101413] text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Key size={16} />
              {isCreating ? "Creating..." : "Create API Key"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAPIKey;
