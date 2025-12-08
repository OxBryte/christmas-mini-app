import { useAccount, useConnect, useDisconnect } from "wagmi";
import { truncateAddress } from "../utils/address";
import { HiOutlineLogout } from "react-icons/hi";

export default function ConnectMenu() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex flex-col items-end gap-3">
        <div className="flex items-end gap-1">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono text-gray-800">
              {truncateAddress(address)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => disconnect()}
            className="px-3 py-2 bg-black hover:bg-gray-800 text-xs text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
          >
            <HiOutlineLogout size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => connect({ connector: connectors[0] })}
      className="px-4 py-2 bg-black hover:bg-gray-800 text-xs text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl active:scale-95"
    >
      Connect Wallet
    </button>
  );
}
