const express = require('express');
const cors = require('cors');
const { bonds, mepRate } = require('./data');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/data', (req, res) => {
  const daysCarry = parseInt(req.query.days) || 0;
  const TEM = 0.11; // 11% mensual proyectada

  const results = bonds.map(bond => {
    // Lógica Axon Carry Engine V1.2
    // Salida Anticipada: Calculá el precio de salida descontando el payoff por la inflación proyectada
    // Interpretación: El precio de salida es el Valor Técnico proyectado por la inflación durante el carry.
    // O visto de otra forma, es el Valor Técnico final descontado a la fecha de salida.
    const carryMonths = daysCarry / 30;
    const exitPrice = bond.technicalValue * Math.pow(1 + TEM, carryMonths);

    // ROI Pesos: Retorno nominal en pesos
    const roiPesos = (exitPrice / bond.price) - 1;

    // MEP Breakeven: ROI en pesos aplicado al MEP de entrada
    const mepBreakeven = mepRate * (1 + roiPesos);

    return {
      symbol: bond.symbol,
      price: bond.price,
      technicalValue: bond.technicalValue,
      duration: bond.duration,
      exitPrice,
      roiPesos,
      mepBreakeven
    };
  });

  // Scoring: Ranking relativo por percentiles entre todos los bonos
  const sortedByROI = [...results].sort((a, b) => a.roiPesos - b.roiPesos);
  const scoredResults = results.map(bond => {
    const rankIndex = sortedByROI.findIndex(b => b.symbol === bond.symbol);
    const score = ((rankIndex + 1) / results.length) * 100;
    return { ...bond, score };
  });

  res.json(scoredResults);
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
