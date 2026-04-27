import express from 'express';
import cors from 'cors';
import { MARKET_DATA, BONDS } from './constants.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/arbitrage', (req, res) => {
  const daysCarry = parseInt(req.query.days as string) || 30;
  const manualDollar = parseFloat(req.query.manualDollar as string) || MARKET_DATA.MEP;
  const TEM = MARKET_DATA.REM_INFLATION;

  const results = BONDS.map(bond => {
    const carryMonths = daysCarry / 30;
    const exitPricePesos = bond.technicalValue * Math.pow(1 + TEM, carryMonths);

    const roiMep = (exitPricePesos / (bond.price * (manualDollar / MARKET_DATA.MEP))) - 1;

    const sensitivity = [];
    for (let dollar = 1300; dollar <= 1800; dollar += 100) {
      const roi = (exitPricePesos / (bond.price * (dollar / MARKET_DATA.MEP))) - 1;
      sensitivity.push({ dollar, roi });
    }

    return {
      symbol: bond.symbol,
      duration: bond.duration,
      exitPricePesos,
      roiMep,
      roiManual: (exitPricePesos / (bond.price * (manualDollar / MARKET_DATA.MEP))) - 1,
      sensitivity
    };
  });

  res.json({
    market: MARKET_DATA,
    results
  });
});

app.listen(PORT, () => {
  console.log(`EcoFlow V2.0 Backend running on port ${PORT}`);
});
