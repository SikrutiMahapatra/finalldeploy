
import { User, Wallet, ActionHistory, Asset, UserRole, AssetLifecycle } from './types.ts';
import { db } from './db.ts';

export const api = {
  async getCurrentUser(): Promise<{ user: User; wallet: Wallet } | null> {
    const user = db.getCurrentUser();
    if (!user) return null;
    const wallet = db.getWallet(user.email);
    return { user, wallet };
  },

  async login(email: string): Promise<User | null> {
    const users = db.getUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      db.setCurrentUser(user);
      return user;
    }
    return null;
  },

  async register(name: string, email: string, role: UserRole): Promise<User> {
    const newUser: User = { name, email, role, isWalletActivated: false };
    db.saveUser(newUser);
    db.setCurrentUser(newUser);
    return newUser;
  },

  async logout() {
    db.setCurrentUser(null);
  },

  async connectWallet(email: string, address: string, nationality: string, idType: string, idNumber: string): Promise<User> {
    db.updateUser(email, { 
      walletAddress: address, 
      nationality, 
      idType: idType as 'PAN' | 'AADHAR', 
      idNumber,
      isWalletActivated: true 
    });
    
    const wallet = db.getWallet(email);
    wallet.history.unshift({
      id: Math.random().toString(36).substring(2, 11),
      type: 'WALLET_ACTIVATE',
      description: `Secured wallet activated via ${idType} verification.`,
      timestamp: new Date().toISOString(),
      txHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      isRead: false
    });
    db.updateWallet(email, wallet);

    const user = db.getCurrentUser();
    return user!;
  },

  async getWallet(email: string): Promise<Wallet> {
    return db.getWallet(email);
  },

  async markHistoryRead(email: string): Promise<void> {
    const wallet = db.getWallet(email);
    wallet.history = wallet.history.map(item => ({ ...item, isRead: true }));
    db.updateWallet(email, wallet);
  },

  async listAsset(email: string, assetData: Partial<Asset>): Promise<void> {
    const newAsset: Asset = {
      id: `prop-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      name: assetData.name || 'Untitled Plot',
      location: assetData.location || 'Unknown Location',
      yieldPercent: Number(assetData.yieldPercent) || 0,
      tokenPrice: Number(assetData.tokenPrice) || 0,
      totalTokens: Number(assetData.totalTokens) || 0,
      image: assetData.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800&h=600',
      risk: assetData.risk || 'Medium',
      status: 'DRAFT',
      ownerEmail: email,
      valuation: Number(assetData.valuation) || 0,
      lastUpdated: new Date().toISOString(),
      documents: [
        { id: 'doc-1', name: 'Title Deed', type: 'TITLE_DEED', status: 'UPLOADED', url: '#' },
        { id: 'doc-2', name: 'Registry Extract', type: 'REGISTRY_EXTRACT', status: 'UPLOADED', url: '#' }
      ]
    };
    db.saveAsset(newAsset);
    
    const wallet = db.getWallet(email);
    wallet.history.unshift({
      id: Math.random().toString(36).substring(2, 11),
      type: 'LIST_ASSET',
      description: `Drafted listing for ${newAsset.name}. Verification pending.`,
      timestamp: new Date().toISOString(),
      isRead: false
    });
    db.updateWallet(email, wallet);
  },

  async submitForAudit(email: string, assetId: string): Promise<void> {
    const asset = db.getAssets().find(a => a.id === assetId);
    if (!asset || asset.status !== 'DRAFT') throw new Error("Invalid state for audit submission.");
    
    db.updateAsset(assetId, { status: 'SUBMITTED', lastUpdated: new Date().toISOString() });
    
    const wallet = db.getWallet(email);
    wallet.history.unshift({
      id: Math.random().toString(36).substring(2, 11),
      type: 'SUBMIT_AUDIT',
      description: `Submitted ${asset.name} for institutional clearance.`,
      timestamp: new Date().toISOString(),
      isRead: false
    });
    db.updateWallet(email, wallet);
  },

  async verifyAsset(email: string, assetId: string): Promise<void> {
    const user = db.getCurrentUser();
    if (user?.role !== 'ADMIN') throw new Error("Unauthorized: Admin clearance required.");

    const asset = db.getAssets().find(a => a.id === assetId);
    if (!asset || asset.status !== 'SUBMITTED') throw new Error("Asset must be in REVIEW state.");

    const mockHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    db.updateAsset(assetId, { 
      status: 'VERIFIED', 
      verificationHash: mockHash,
      verificationDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    });

    const wallet = db.getWallet(email);
    wallet.history.unshift({
      id: Math.random().toString(36).substring(2, 11),
      type: 'VERIFY',
      description: `Institutional Verification completed for ${asset.name}.`,
      timestamp: new Date().toISOString(),
      isRead: false
    });
    db.updateWallet(email, wallet);
  },

  async tokenizeAsset(email: string, assetId: string): Promise<void> {
    const asset = db.getAssets().find(a => a.id === assetId);
    if (!asset || asset.status !== 'VERIFIED') throw new Error("Asset must be VERIFIED to tokenize.");

    db.updateAsset(assetId, { 
      status: 'ACTIVE',
      contractAddress: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      lastUpdated: new Date().toISOString()
    });

    const wallet = db.getWallet(email);
    wallet.history.unshift({
      id: Math.random().toString(36).substring(2, 11),
      type: 'TOKENIZE',
      description: `Fractional units live for ${asset.name}.`,
      timestamp: new Date().toISOString(),
      txHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      isRead: false
    });
    db.updateWallet(email, wallet);
  },

  async pauseAsset(email: string, assetId: string): Promise<void> {
    const user = db.getCurrentUser();
    if (user?.role !== 'ADMIN') throw new Error("Admin authority required.");

    db.updateAsset(assetId, { status: 'PAUSED', lastUpdated: new Date().toISOString() });
    
    const wallet = db.getWallet(email);
    wallet.history.unshift({
      id: Math.random().toString(36).substring(2, 11),
      type: 'PAUSE',
      description: `Paused trading for Asset ${assetId}`,
      timestamp: new Date().toISOString(),
      isRead: false
    });
    db.updateWallet(email, wallet);
  },

  async buyTokens(email: string, assetId: string, amount: number): Promise<{ txHash: string; wallet: Wallet }> {
    const wallet = db.getWallet(email);
    const asset = db.getAssets().find(a => a.id === assetId);
    if (!asset || asset.status !== 'ACTIVE') throw new Error("Asset is not tradeable.");

    const price = Number(asset.tokenPrice);
    const cost = Number(amount) * price;
    
    if (Number(wallet.stablecoinBalance) < cost) throw new Error("Insufficient INR balance.");

    wallet.tokensByAsset[assetId] = (Number(wallet.tokensByAsset[assetId]) || 0) + Number(amount);
    wallet.stablecoinBalance = Number(wallet.stablecoinBalance) - cost;
    wallet.totalInvested = Number(wallet.totalInvested) + cost;
    
    const action: ActionHistory = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'BUY_TOKENS',
      description: `Acquired ${amount} units of ${asset.name}`,
      timestamp: new Date().toISOString(),
      amount: `₹${cost.toLocaleString()}`,
      txHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      isRead: false
    };
    
    wallet.history.unshift(action);
    db.updateWallet(email, wallet);
    return { txHash: action.txHash!, wallet };
  },

  async swapToStable(email: string, assetId: string, amount: number): Promise<{ txHash: string; wallet: Wallet }> {
    const wallet = db.getWallet(email);
    const asset = db.getAssets().find(a => a.id === assetId);
    if (!asset || asset.status === 'PAUSED' || asset.status === 'DISPUTED') throw new Error("Asset units are frozen.");
    
    const price = Number(asset.tokenPrice);
    const value = Number(amount) * price;
    
    const owned = Number(wallet.tokensByAsset[assetId]) || 0;
    if (owned < Number(amount)) throw new Error("Insufficient units.");

    wallet.tokensByAsset[assetId] = owned - Number(amount);
    wallet.stablecoinBalance = Number(wallet.stablecoinBalance) + value;
    wallet.totalInvested = Math.max(0, Number(wallet.totalInvested) - value);

    const action: ActionHistory = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'SWAP',
      description: `Liquidated ${amount} units of ${asset.name} to INR`,
      timestamp: new Date().toISOString(),
      amount: `₹${value.toLocaleString()}`,
      txHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      isRead: false
    };

    wallet.history.unshift(action);
    db.updateWallet(email, wallet);
    return { txHash: action.txHash!, wallet };
  },

  async lockCollateral(email: string, assetId: string, amount: number): Promise<{ txHash: string; wallet: Wallet }> {
    const wallet = db.getWallet(email);
    const asset = db.getAssets().find(a => a.id === assetId);
    if (!asset) throw new Error("Asset not found");
    
    const owned = Number(wallet.tokensByAsset[assetId]) || 0;
    if (owned < Number(amount)) throw new Error("Insufficient free units to lock.");

    const assetValue = Number(amount) * Number(asset.tokenPrice);
    const creditLine = assetValue * 0.6; // 60% LTV Credit issued

    wallet.tokensByAsset[assetId] = owned - Number(amount);
    wallet.lockedCollateral = Number(wallet.lockedCollateral) + assetValue;
    wallet.stablecoinBalance = Number(wallet.stablecoinBalance) + creditLine; // Issue credit

    const action: ActionHistory = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'COLLATERAL_LOCK',
      description: `Locked ${amount} units of ${asset.name}. Credit Line of ₹${creditLine.toLocaleString()} issued.`,
      timestamp: new Date().toISOString(),
      txHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      isRead: false
    };

    wallet.history.unshift(action);
    db.updateWallet(email, wallet);
    return { txHash: action.txHash!, wallet };
  },

  async pay(email: string, amount: number): Promise<{ txHash: string; wallet: Wallet }> {
    const wallet = db.getWallet(email);
    const balance = Number(wallet.stablecoinBalance) || 0;
    if (balance < Number(amount)) throw new Error("Insufficient wallet balance for this settlement.");
    
    wallet.stablecoinBalance = balance - Number(amount);
    
    const action: ActionHistory = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'PAYMENT',
      description: `Settled payment of ₹${amount.toLocaleString()} via Value Rail`,
      timestamp: new Date().toISOString(),
      amount: `₹${amount.toLocaleString()}`,
      txHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      isRead: false
    };
    
    wallet.history.unshift(action);
    db.updateWallet(email, wallet);
    return { txHash: action.txHash!, wallet };
  }
};
