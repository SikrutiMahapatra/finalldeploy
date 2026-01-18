
export type UserRole = 'BUILDER' | 'INVESTOR' | 'ADMIN';

export type AssetLifecycle = 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'TOKENIZED' | 'ACTIVE' | 'PAUSED' | 'REJECTED' | 'DISPUTED';

export interface PropertyDocument {
  id: string;
  name: string;
  type: 'TITLE_DEED' | 'REGISTRY_EXTRACT' | 'TAX_RECEIPT' | 'SURVEY_MAP';
  status: 'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED';
  url: string;
}

export interface Asset {
  id: string;
  name: string;
  location: string;
  yieldPercent: number;
  tokenPrice: number;
  totalTokens: number;
  image: string;
  risk: 'Low' | 'Medium' | 'High';
  status: AssetLifecycle;
  contractAddress?: string;
  ownerEmail?: string;
  ownerName?: string;
  verificationHash?: string;
  verificationDate?: string;
  documents?: PropertyDocument[];
  valuation?: number;
  lastUpdated?: string;
}

export interface User {
  name: string;
  email: string;
  role: UserRole;
  walletAddress?: string;
  nationality?: string;
  idNumber?: string;
  idType?: 'PAN' | 'AADHAR';
  isWalletActivated?: boolean;
}

export interface Wallet {
  tokensByAsset: Record<string, number>;
  totalInvested: number;
  stablecoinBalance: number;
  lockedCollateral: number;
  history: ActionHistory[];
  network: string;
}

export interface ActionHistory {
  id: string;
  type: 'VERIFY' | 'BUY_TOKENS' | 'SWAP' | 'PAYMENT' | 'COLLATERAL_LOCK' | 'LIST_ASSET' | 'TOKENIZE' | 'SUBMIT_AUDIT' | 'REJECT' | 'PAUSE' | 'WALLET_ACTIVATE';
  description: string;
  timestamp: string;
  amount?: string;
  txHash?: string;
  isRead?: boolean;
}

export interface AuthContextType {
  user: User | null;
  wallet: Wallet;
  isConnecting: boolean;
  isWalletModalOpen: boolean;
  setWalletModalOpen: (open: boolean) => void;
  connectWallet: (data: { email: string; nationality: string; idType: 'PAN' | 'AADHAR'; idNumber: string }) => Promise<void>;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => void;
  buyTokens: (assetId: string, amount: number) => Promise<string>;
  swapToStablecoin: (assetId: string, tokenAmount: number) => Promise<string>;
  lockAsCollateral: (assetId: string, tokenAmount: number) => Promise<string>;
  makePayment: (amount: number) => Promise<boolean>;
  listAsset: (assetData: Partial<Asset>) => Promise<void>;
  submitForAudit: (assetId: string) => Promise<void>;
  verifyAssetAdmin: (assetId: string) => Promise<void>;
  rejectAssetAdmin: (assetId: string, reason: string) => Promise<void>;
  tokenizeAssetBuilder: (assetId: string) => Promise<void>;
  pauseAssetAdmin: (assetId: string) => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;
}
