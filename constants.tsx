
import { Asset, Wallet } from './types';

export const DUMMY_ASSETS: Asset[] = [
  {
    id: 'plot-001',
    name: 'Emerald Meadows',
    location: 'Sarjapur, Bengaluru',
    yieldPercent: 9.2,
    tokenPrice: 5000,
    totalTokens: 20000,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200&h=800',
    risk: 'Low',
    status: 'ACTIVE',
    contractAddress: '0x811567...334',
    ownerEmail: 'builder@example.com',
    ownerName: 'Vikas Construction Ltd.'
  },
  {
    id: 'plot-002',
    name: 'Heritage Acres',
    location: 'Nandi Hills, Karnataka',
    yieldPercent: 12.5,
    tokenPrice: 8500,
    totalTokens: 15000,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200&h=800',
    risk: 'Medium',
    status: 'ACTIVE',
    contractAddress: '0x99281...112',
    ownerEmail: 'builder@example.com',
    ownerName: 'Apex Realty Group'
  },
  {
    id: 'plot-003',
    name: 'Royal Palm Grove',
    location: 'ECR, Chennai',
    yieldPercent: 8.8,
    tokenPrice: 12000,
    totalTokens: 10000,
    image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&q=80&w=1200&h=800',
    risk: 'Low',
    status: 'VERIFIED',
    ownerEmail: 'builder@example.com',
    ownerName: 'Elite Estates India',
    verificationHash: '0x77d1...e42'
  },
  {
    id: 'plot-004',
    name: 'Cyber Vista Suites',
    location: 'Cyber City, Gurgaon',
    yieldPercent: 10.4,
    tokenPrice: 15000,
    totalTokens: 5000,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200&h=800',
    risk: 'Low',
    status: 'VERIFIED',
    ownerEmail: 'builder@example.com',
    ownerName: 'Capital Hub Developments',
    verificationHash: '0x88f2...b11'
  }
];

export const INITIAL_WALLET: Wallet = {
  tokensByAsset: {
    'plot-001': 50,
    'plot-002': 0,
    'plot-003': 10,
  },
  totalInvested: 370000,
  stablecoinBalance: 150000,
  lockedCollateral: 0,
  history: [
    { id: '1', type: 'BUY_TOKENS', description: 'Bought 50 units of Emerald Meadows', timestamp: '2024-05-10T14:30:00Z', amount: '₹2,50,000' },
    { id: '2', type: 'VERIFY', description: 'Institutional clearance for Royal Palm Grove', timestamp: '2024-05-11T10:15:00Z' }
  ],
  network: 'Polygon Mainnet'
};
