const express = require('express');
const { Pool, Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'siku1046',
    database: 'onblock',
};

// Function to ensure database exists
const ensureDatabaseExists = async () => {
    const client = new Client({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        database: 'postgres', // Connect to default postgres db
    });

    try {
        await client.connect();
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = 'onblock'`);
        if (res.rowCount === 0) {
            console.log("🛠️ Database 'onblock' not found. Creating it...");
            await client.query(`CREATE DATABASE onblock`);
            console.log("✅ Database 'onblock' created successfully.");
        } else {
            console.log("✅ Database 'onblock' already exists.");
        }
    } catch (err) {
        console.error("❌ Error checking/creating database:", err.message);
    } finally {
        await client.end();
    }
};

const pool = new Pool(dbConfig);

// Table Creation Queries
const createTablesQuery = `
  CREATE TABLE IF NOT EXISTS dashboard (
    id SERIAL PRIMARY KEY,
    wallet_balance DECIMAL(15, 2) DEFAULT 0,
    total_investment DECIMAL(15, 2) DEFAULT 0,
    monthly_yield DECIMAL(15, 2) DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    apy DECIMAL(5, 2) NOT NULL,
    price_per_token DECIMAL(15, 2) NOT NULL,
    tokens_available INTEGER NOT NULL
  );
`;

// Seed Logic - Inserts dummy data if tables are empty
const seedData = async () => {
    try {
        const dashboardCheck = await pool.query('SELECT COUNT(*) FROM dashboard');
        if (parseInt(dashboardCheck.rows[0].count) === 0) {
            await pool.query('INSERT INTO dashboard (wallet_balance, total_investment, monthly_yield) VALUES (15000.00, 5200.00, 435.50)');
            console.log('✅ Seed: Dashboard table initialized.');
        }

        const assetsCheck = await pool.query('SELECT COUNT(*) FROM assets');
        if (parseInt(assetsCheck.rows[0].count) === 0) {
            const dummyAssets = [
                ['Skyline Apartments', 'New York, NY', 8.5, 50.00, 1000],
                ['Ocean View Villa', 'Miami, FL', 12.0, 150.00, 500],
                ['Mountain Retreat', 'Aspen, CO', 10.2, 75.00, 800],
                ['Downtown Office', 'Chicago, IL', 9.8, 120.00, 1200],
            ];
            for (const asset of dummyAssets) {
                await pool.query(
                    'INSERT INTO assets (name, location, apy, price_per_token, tokens_available) VALUES ($1, $2, $3, $4, $5)',
                    asset
                );
            }
            console.log('✅ Seed: Assets table initialized.');
        }
    } catch (err) {
        console.error('❌ Error seeding data:', err);
    }
};

// Initialize DB schema and seed
const initDB = async () => {
    try {
        await ensureDatabaseExists();
        await pool.query(createTablesQuery);
        await seedData();
        console.log('🚀 Database schema ready and seeded.');
    } catch (err) {
        console.error('❌ Database Initialization Error:', err);
    }
};

initDB();

// --- API Endpoints ---

// GET /dashboard
app.get('/dashboard', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM dashboard LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        res.status(500).json({ error: 'Database query failed', details: err.message });
    }
});

// GET /assets
app.get('/assets', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM assets ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database query failed', details: err.message });
    }
});

// POST /invest
app.post('/invest', async (req, res) => {
    const { assetId, tokensToBuy } = req.body;

    if (!assetId || !tokensToBuy || tokensToBuy <= 0) {
        return res.status(400).json({ error: 'Valid assetId and tokensToBuy are required' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Fetch asset details
        const assetRes = await client.query('SELECT * FROM assets WHERE id = $1', [assetId]);
        if (assetRes.rows.length === 0) {
            throw new Error('Asset not found');
        }
        const asset = assetRes.rows[0];

        // 2. Check token availability
        if (asset.tokens_available < tokensToBuy) {
            throw new Error('Not enough tokens available in this asset');
        }

        const totalCost = asset.price_per_token * tokensToBuy;

        // 3. Check wallet balance from dashboard
        const dashRes = await client.query('SELECT * FROM dashboard LIMIT 1');
        const dashboard = dashRes.rows[0];
        if (parseFloat(dashboard.wallet_balance) < totalCost) {
            throw new Error('Insufficient wallet balance to complete transaction');
        }

        // 4. Update Assets table (decrease availability)
        await client.query(
            'UPDATE assets SET tokens_available = tokens_available - $1 WHERE id = $2',
            [tokensToBuy, assetId]
        );

        // 5. Update Dashboard table
        const newTotalInvestment = parseFloat(dashboard.total_investment) + totalCost;
        const newWalletBalance = parseFloat(dashboard.wallet_balance) - totalCost;

        // Formula for additional yield: (Cost * APY%) / 12
        const addedMonthlyYield = (totalCost * (parseFloat(asset.apy) / 100)) / 12;
        const newMonthlyYield = parseFloat(dashboard.monthly_yield) + addedMonthlyYield;

        await client.query(
            'UPDATE dashboard SET wallet_balance = $1, total_investment = $2, monthly_yield = $3 WHERE id = $4',
            [newWalletBalance, newTotalInvestment, newMonthlyYield, dashboard.id]
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Investment processed successfully',
            data: {
                spent: totalCost,
                remainingBalance: newWalletBalance,
                newTotalInvestment: newTotalInvestment,
                newMonthlyYield: newMonthlyYield
            }
        });

    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`\n✅ Backend server is live at http://localhost:${PORT}`);
    console.log(`📡 Endpoints: GET /dashboard, GET /assets, POST /invest`);
});
