import { useState } from "react";
import { X, Copy, Check, QrCode, Wallet } from "lucide-react";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonateModal = ({ isOpen, onClose }: DonateModalProps) => {
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);

  const upiId = "9034961137@ptsbi";
  const walletAddress = "BtbrbDNZ7eR48L5jL7Tnt9VGEPt3oG95o4WXyokQ4no8";

  const copyToClipboard = (text: string, type: "upi" | "wallet") => {
    navigator.clipboard.writeText(text);
    if (type === "upi") {
      setCopiedUPI(true);
      setTimeout(() => setCopiedUPI(false), 2000);
    } else {
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-blue-950/40 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-300">
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_32px_rgba(26,115,232,0.15)] overflow-hidden">
          {/* Blue glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-200 text-gray-500 hover:text-gray-700 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative p-8">
            {/* Title */}
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
              Donate
            </h2>
            <p className="text-gray-500 text-center text-sm mb-8">
              By donating, you agree to our Terms of Service and Privacy Policy
            </p>

            {/* Options */}
            <div className="space-y-4">
              {/* UPI Option */}
              <button
                onClick={() => copyToClipboard(upiId, "upi")}
                className="w-full group flex items-center gap-4 p-4 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/50 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-800">UPI Payment</p>
                  <p className="text-sm text-gray-500 font-mono">{upiId}</p>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  {copiedUPI ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                </div>
              </button>

              {/* Wallet Option */}
              <button
                onClick={() => copyToClipboard(walletAddress, "wallet")}
                className="w-full group flex items-center gap-4 p-4 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/50 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-lg shadow-cyan-500/30">
                  <Wallet className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-800">Wallet Address</p>
                  <p className="text-sm text-gray-500 font-mono">{walletAddress}</p>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  {copiedWallet ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateModal;
