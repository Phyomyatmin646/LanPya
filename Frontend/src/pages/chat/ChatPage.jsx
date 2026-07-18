import ChatComponent from '../../components/chat/ChatComponent';

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-64px)] w-full max-w-[1216px] mx-auto px-4 sm:px-6 py-6">
      <div className="gh-box h-full flex flex-col overflow-hidden">
        <div className="gh-box-header flex items-center justify-between bg-white border-b border-[#D0D7DE]">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">LanPya Copilot</span>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs border border-accent/20">Beta</span>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-[#F6F8FA]">
          <ChatComponent />
        </div>
      </div>
    </div>
  );
}
