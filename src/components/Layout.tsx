import ConnectMenu from "./ConnectMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-3 w-full mx-auto h-screen flex items-center justify-center">
      <div className="w-full mx-auto max-w-[440px] flex flex-col gap-4">
        <div className="flex items-center gap-2 justify-between w-full">
          <p>Logo</p>
          <ConnectMenu />
        </div>
        <div className="w-full bg-white rounded-lg p-5 border border-gray-100 h-[50vh] flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
