import ConnectMenu from "./ConnectMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-3 w-full mx-auto h-screen flex items-center justify-center">
      <div className="w-full mx-auto max-w-xl flex flex-col gap-4">
        <div className="flex items-center gap-2 justify-between w-full">
          <p>Logo</p>
          <ConnectMenu />
        </div>
        {children}
      </div>
    </div>
  );
}
