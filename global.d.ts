// global.d.ts

interface Window {
  ethereum: {
     isMetaMask: boolean;
     request: (...args: any[]) => Promise<void>;
     enable: () => Promise<string[]>;
     on: (...args: any[]) => void;
     removeListener: (...args: any[]) => void;
     selectedAddress: string;
  };
 }
 // src/types/global.d.ts

