import ConnectMenu from "./ConnectMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-3">
      <div className="flex items-center gap-2 justify-between w-full">
        <img src="/logo.png" alt="logo" className="w-10 h-10" />
        <ConnectMenu />
      </div>
      {children}
    </div>
  );
}
