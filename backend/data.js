const bonds = [
  {
    symbol: 'TX26',
    price: 1350.5,
    technicalValue: 1420.0,
    duration: 1.5,
    daysToMaturity: 730,
  },
  {
    symbol: 'T2X4',
    price: 1210.0,
    technicalValue: 1260.0,
    duration: 0.4,
    daysToMaturity: 150,
  },
  {
    symbol: 'AL30',
    price: 68500.0,
    technicalValue: 130000.0, // Assuming 100 USD at 1300 MEP
    duration: 2.8,
    daysToMaturity: 2190,
  }
];

const mepRate = 1320.0;

module.exports = { bonds, mepRate };
