
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, Wallet, UserRole, Asset } from '../types.ts';
import { INITIAL_WALLET } from '../constants.tsx';
import { api } from '../api.ts';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet>(INITIAL_WALLET);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      try {
        const session = await api.getCurrentUser();
        if (session) {
          setUser(session.user);
          setWallet(session.wallet);
        }
      } catch (error) {
        console.warn("Session hydration bypassed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initSession();
  }, []);

  const connectWallet = async (data: { email: string; nationality: string; idType: 'PAN' | 'AADHAR'; idNumber: string }) => {
    if (!user) return;
    setIsConnecting(true);
    try {
      const mockAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
      const updatedUser = await api.connectWallet(
        data.email, 
        mockAddress, 
        data.nationality, 
        data.idType, 
        data.idNumber
      );
      setUser(updatedUser);
      const w = await api.getWallet(updatedUser.email);
      setWallet(w);
    } finally {
      setIsConnecting(false);
    }
  };

  const markNotificationsAsRead = async () => {
    if (!user) return;
    await api.markHistoryRead(user.email);
    const w = await api.getWallet(user.email);
    setWallet(w);
  };

  const signIn = async (email: string) => {
    const existingUser = await api.login(email);
    if (existingUser) {
      setUser(existingUser);
      const w = await api.getWallet(existingUser.email);
      setWallet(w);
    } else {
      throw new Error("Identity not found. Please register.");
    }
  };

  const signUp = async (email: string, name: string, role: UserRole) => {
    const newUser = await api.register(name, email, role);
    setUser(newUser);
    const w = await api.getWallet(newUser.email);
    setWallet(w);
  };

  const signOut = async () => {
    await api.logout();
    setUser(null);
    setWallet(INITIAL_WALLET);
  };

  const listAsset = async (assetData: Partial<Asset>) => {
    if (!user) return;
    await api.listAsset(user.email, assetData);
    const w = await api.getWallet(user.email);
    setWallet(w);
  };

  const submitForAudit = async (assetId: string) => {
    if (!user) return;
    await api.submitForAudit(user.email, assetId);
    const w = await api.getWallet(user.email);
    setWallet(w);
  };

  const verifyAssetAdmin = async (assetId: string) => {
    if (!user) return;
    await api.verifyAsset(user.email, assetId);
    const w = await api.getWallet(user.email);
    setWallet(w);
  };

  const rejectAssetAdmin = async (assetId: string) => {
    // Implementation placeholder for rejection
    console.log("Rejecting asset", assetId);
  };

  const pauseAssetAdmin = async (assetId: string) => {
    if (!user) return;
    await api.pauseAsset(user.email, assetId);
    const w = await api.getWallet(user.email);
    setWallet(w);
  };

  const tokenizeAssetBuilder = async (assetId: string) => {
    if (!user) return;
    await api.tokenizeAsset(user.email, assetId);
    const w = await api.getWallet(user.email);
    setWallet(w);
  };

  const buyTokens = async (assetId: string, amount: number) => {
    if (!user) return '';
    const result = await api.buyTokens(user.email, assetId, amount);
    setWallet(result.wallet);
    return result.txHash;
  };

  const swapToStablecoin = async (assetId: string, tokenAmount: number) => {
    if (!user) return '';
    const result = await api.swapToStable(user.email, assetId, tokenAmount);
    setWallet(result.wallet);
    return result.txHash;
  };

  const lockAsCollateral = async (assetId: string, tokenAmount: number) => {
    if (!user) return '';
    const result = await api.lockCollateral(user.email, assetId, tokenAmount);
    setWallet(result.wallet);
    return result.txHash;
  };

  const makePayment = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    try {
      const result = await api.pay(user.email, amount);
      setWallet(result.wallet);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, wallet, isConnecting, isWalletModalOpen, setWalletModalOpen, connectWallet, signIn, signUp, signOut, 
      buyTokens, swapToStablecoin, lockAsCollateral, makePayment, listAsset,
      submitForAudit, verifyAssetAdmin, rejectAssetAdmin, tokenizeAssetBuilder,
      pauseAssetAdmin, markNotificationsAsRead
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
