"use client";

import { WalletProvider } from "@/context/WalletContext";
import SimpleTransferMain from "./components/SimpleTransferMain";

export default function Home() {


 return (
  <WalletProvider>
    <SimpleTransferMain/>
    </WalletProvider>
 );
}
