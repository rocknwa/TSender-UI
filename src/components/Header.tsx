import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white-500 border-b">
      {/* Left section - Title & GitHub */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">tsender</h1>
        <a 
          href="https://github.com/rocknwa" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-black"
        >
          <FaGithub size={24} />
        </a>
      </div>

      {/* Right section - Connect Button */}
      <ConnectButton />
    </header>
  );
}