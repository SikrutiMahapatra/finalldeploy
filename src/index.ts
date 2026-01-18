
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Import Routes
import authRoutes from './api/authRoutes';
import assetRoutes from './api/assetRoutes';
import transactionRoutes from './api/transactionRoutes';
import accountRoutes from './api/accountRoutes';
import { requireAuth, AuthRequest } from './middleware/auth';
import { getWalletPositions, getWalletSummary } from './services/walletService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const appInstance = app as any;

appInstance.use(cors());
appInstance.use(express.json());

// --- API ROUTES ---
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/assets', assetRoutes);
apiRouter.use('/account', accountRoutes);
apiRouter.use('/fractional', transactionRoutes);
apiRouter.use('/swap', transactionRoutes);
apiRouter.use('/pay', transactionRoutes);
apiRouter.use('/collateral', transactionRoutes);
apiRouter.use('/verify', assetRoutes);

apiRouter.get('/wallet/summary', requireAuth, (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) {
    return (res as any).status(401).json({ success: false, error: { message: 'Identity required' } });
  }
  const summary = getWalletSummary(userId);
  (res as any).json({ success: true, data: summary });
});

apiRouter.get('/wallet/positions', requireAuth, (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) {
    return (res as any).status(401).json({ success: false, error: { message: 'Identity required' } });
  }
  const positions = getWalletPositions(userId);
  (res as any).json({ success: true, data: positions });
});

apiRouter.get('/yield', requireAuth, (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) {
    return (res as any).status(401).json({ success: false, error: { message: 'Identity required' } });
  }
  const positions = getWalletPositions(userId);
  const yieldHistory = [
    { month: 'Jan', income: 4500 }, { month: 'Feb', income: 5200 },
    { month: 'Mar', income: 4800 }, { month: 'Apr', income: 6100 },
    { month: 'May', income: 5900 }, { month: 'Jun', income: 7200 },
    { month: 'Jul', income: 8400 }, { month: 'Aug', income: 8100 },
    { month: 'Sep', income: 9300 }, { month: 'Oct', income: 10500 },
    { month: 'Nov', income: 11200 }, { month: 'Dec', income: 12500 },
  ];
  const yieldData = positions.map(p => ({
    assetId: p.assetId,
    assetName: p.assetName,
    currentYieldPercentage: p.yieldPercentage,
    monthlyIncome: Math.round(p.currentValue * (p.yieldPercentage / 100) / 12),
    yearlyIncome: Math.round(p.currentValue * (p.yieldPercentage / 100))
  }));
  (res as any).json({ success: true, data: { yields: yieldData, history: yieldHistory } });
});

// Mount the API Router
app.use('/api', apiRouter);

// --- STATIC ASSETS ---
// Serve static files (index.html, index.tsx, etc.) from the root directory
app.use(express.static(path.resolve('.')));

// --- SPA FALLBACK ---
// For any request that doesn't match an API route or a specific file, serve index.html
// This is critical for React Router to work correctly on page refresh.
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve('index.html'));
});

// Centralized Error Handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[System Error]:', err.stack);
  (res as any).status(500).json({
    success: false,
    error: {
      code: 'PROTOCOL_ERROR',
      message: err.message || 'Internal ledger processing error'
    }
  });
});

app.listen(PORT, () => {
  console.log(`PropToken Backend running on port ${PORT}`);
});
