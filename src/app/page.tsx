"use client";

import { WalletProvider } from "@/context/WalletContext";
import SimpleTransferMain from "../components/SimpleTransferMain";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <WalletProvider>
      <Navbar />
      <SimpleTransferMain />
    </WalletProvider>
  );
}
