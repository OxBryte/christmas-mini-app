import { useState, useEffect } from "react";
import { useSignMessage } from "wagmi";

interface SignButtonProps {
  onSigned?: () => void;
  required?: boolean;
}

export default function SignButton({
  onSigned,
  required = true,
}: SignButtonProps) {
  const { signMessage, isPending, data, error } = useSignMessage();
  const [hasSigned, setHasSigned] = useState(false);

  useEffect(() => {
    if (data) {
      setHasSigned(true);
      required && onSigned?.();
    }
  }, [data, onSigned, required]);

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <button
        type="button"
        onClick={() =>
          signMessage({ message: "I agree to create a Christmas gift" })
        }
        disabled={isPending}
        className="w-fit px-6 py-2.5 bg-gradient-to-br from-black to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold rounded-lg transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-base"
      >
        {isPending ? "Signing..." : "🎁 Sign in to create a Gift"}
      </button>
      {error && (
        <div className="text-xs text-red-400 bg-red-900/30 border border-red-700 rounded px-2 py-1">
          {error.message}
        </div>
      )}
    </div>
  );
}
