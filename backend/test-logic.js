const { bonds, mepRate } = require('./data');

function calculate(daysCarry) {
  const TEM = 0.11;
  const results = bonds.map(bond => {
    const carryMonths = daysCarry / 30;
    const exitPrice = bond.technicalValue * Math.pow(1 + TEM, carryMonths);
    const roiPesos = (exitPrice / bond.price) - 1;
    const mepBreakeven = mepRate * (1 + roiPesos);
    return { symbol: bond.symbol, roiPesos, mepBreakeven };
  });
  return results;
}

console.log('Test logic for 30 days carry:');
console.log(calculate(30));

console.log('Test logic for 60 days carry:');
console.log(calculate(60));
