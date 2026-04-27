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
  const TEM = MARKET_DATA.REM_INFLATION; // 11% mensual

  const results = BONDS.map(bond => {
    // Lógica Quant: Salida Anticipada
    // Se calcula descontando el payoff (Technical Value a vencimiento) por la inflación proyectada
    // hasta la fecha de salida (daysCarry).
    const remainingDays = Math.max(0, bond.daysToMaturity - daysCarry);
    const remainingMonths = remainingDays / 30;

    // Exit Price = Payoff / (1 + TEM)^(meses restantes hasta vencimiento)
    const exitPricePesos = bond.technicalValue / Math.pow(1 + TEM, remainingMonths);

    // Dólar Oficial Proyectado: Ajustado por inflación (Crawl constante = TEM)
    const carryMonths = daysCarry / 30;
    const projectedOfficial = MARKET_DATA.OFFICIAL * Math.pow(1 + TEM, carryMonths);

    // ROI contra Escenario Manual
    const roiManual = (exitPricePesos / (bond.price * (manualDollar / MARKET_DATA.MEP))) - 1;

    // Arbitraje contra MEP (usando el MEP de entrada como referencia)
    const roiMep = (exitPricePesos / bond.price) - 1;

    // Matriz de Sensibilidad: ROI variando el nivel del dólar a la salida
    const sensitivity = [];
    for (let dollar = 1300; dollar <= 1800; dollar += 100) {
      const roi = (exitPricePesos / (bond.price * (dollar / MARKET_DATA.MEP))) - 1;
      sensitivity.push({ dollar, roi });
    }

    return {
      symbol: bond.symbol,
      duration: bond.duration,
      exitPricePesos,
      projectedOfficial,
      roiMep,
      roiManual,
      sensitivity
    };
  });

  res.json({
    market: {
      ...MARKET_DATA,
      PROJECTED_OFFICIAL: MARKET_DATA.OFFICIAL * Math.pow(1 + TEM, daysCarry / 30)
    },
    results
  });
});

app.listen(PORT, () => {
  console.log(`EcoFlow V2.0 Backend running on port ${PORT}`);
});
