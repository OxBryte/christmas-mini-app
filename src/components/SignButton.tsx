import { useState, useEffect } from "react";
import { useSignMessage } from "wagmi";

interface SignButtonProps {
  onSigned?: () => void;
  required?: boolean;
}

export default function SignButton({ onSigned, required = false }: SignButtonProps) {
  const { signMessage, isPending, data, error } = useSignMessage();
  const [hasSigned, setHasSigned] = useState(false);

  useEffect(() => {
    if (data) {
      setHasSigned(true);
      onSigned?.();
    }
  }, [data, onSigned]);

  if (hasSigned) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/30 border border-green-700 rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-xs text-green-400 font-medium">Message Signed</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => signMessage({ message: "I agree to create a Christmas gift" })}
        disabled={isPending}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Signing..." : "Sign Message"}
      </button>
      {error && (
        <div className="text-xs text-red-400 bg-red-900/30 border border-red-700 rounded px-2 py-1">
          {error.message}
        </div>
      )}
      {required && !hasSigned && (
        <p className="text-xs text-yellow-400">You must sign the message to continue</p>
      )}
    </div>
  );
}
