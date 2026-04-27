import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis
} from 'recharts';
import { Shield, Zap, BarChart3, Settings2, DollarSign } from 'lucide-react';

const App = () => {
  const [days, setDays] = useState(30);
  const [manualDollar, setManualDollar] = useState(1400);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/arbitrage?days=${days}&manualDollar=${manualDollar}`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [days, manualDollar]);

  if (!data) return <div className="bg-axon-black min-h-screen text-axon-white flex items-center justify-center">Loading EcoFlow V2.0 Terminal...</div>;

  const results = data.results;
  const winner = [...results].sort((a, b) => b.roiManual - a.roiManual)[0];

  return (
    <div className="min-h-screen bg-axon-black text-axon-white font-sans p-6">
      <header className="flex justify-between items-center mb-8 border-b border-axon-blue pb-4">
        <div>
          <h1 className="text-3xl font-title font-bold tracking-tighter flex items-center">
            <Zap className="mr-2 text-axon-white" fill="white" /> ECOFLOW <span className="text-axon-white/50 ml-2">V2.0</span>
          </h1>
          <p className="text-xs text-axon-white/40 uppercase tracking-widest mt-1">Terminal de Arbitraje & Carry Trade</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] text-axon-white/40 uppercase">Dólar MEP</p>
            <p className="font-bold text-axon-white">${data.market.MEP}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-axon-white/40 uppercase">Dólar Futuro</p>
            <p className="font-bold text-axon-white">${data.market.FUTURE}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Controls */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-axon-blue/20 p-6 rounded border border-axon-blue/40">
            <h3 className="text-sm font-bold mb-6 flex items-center uppercase tracking-wider">
              <Settings2 className="mr-2 w-4 h-4" /> Simulador de Escenarios
            </h3>

            <div className="mb-6">
              <label className="block text-[11px] uppercase text-axon-white/50 mb-2">Días de Carry</label>
              <input
                type="range" min="0" max="365" value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full accent-axon-white h-1 bg-axon-blue rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] mt-2 text-axon-white/30 font-mono">
                <span>0D</span>
                <span className="text-axon-white">{days} DÍAS</span>
                <span>365D</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-axon-white/50 mb-2">Dólar Proyectado Manual</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-axon-white/40 font-mono text-sm">$</span>
                <input
                  type="number" value={manualDollar}
                  onChange={(e) => setManualDollar(parseInt(e.target.value))}
                  className="w-full bg-axon-black border border-axon-blue/50 rounded py-2 pl-7 pr-3 text-sm font-mono focus:outline-none focus:border-axon-white transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-axon-blue/10 p-6 rounded border border-axon-blue/20">
            <h3 className="text-[10px] uppercase tracking-widest text-axon-white/40 mb-4">Bono Recomendado</h3>
            <div className="text-2xl font-title font-bold text-axon-white mb-1">{winner.symbol}</div>
            <div className="text-green-400 font-mono text-sm font-bold">+{(winner.roiManual * 100).toFixed(2)}% ROI</div>
            <p className="text-[10px] text-axon-white/30 mt-2">Basado en escenario de ${manualDollar} a {days} días.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opportunity Chart */}
            <div className="bg-axon-blue/5 p-6 rounded border border-axon-blue/20">
              <h3 className="text-sm font-bold mb-6 uppercase tracking-wider flex items-center">
                <BarChart3 className="mr-2 w-4 h-4" /> Mapa de Oportunidades
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A283E" vertical={false} />
                    <XAxis
                      type="number" dataKey="duration" name="Duration" unit="y" stroke="#F6F7F6" fontSize={10}
                      label={{ value: 'DURATION', position: 'insideBottom', offset: -5, fill: '#F6F7F6', fontSize: 8 }}
                    />
                    <YAxis
                      type="number" dataKey="roiManual" name="ROI" stroke="#F6F7F6" fontSize={10}
                      tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                      label={{ value: 'ROI %', angle: -90, position: 'insideLeft', fill: '#F6F7F6', fontSize: 8 }}
                    />
                    <ZAxis type="number" range={[100, 100]} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ backgroundColor: '#0D1A29', border: '1px solid #1A283E', fontSize: '10px' }}
                    />
                    <Scatter name="Bonos" data={results}>
                      {results.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.symbol === winner.symbol ? '#F6F7F6' : '#1A283E'} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sensitivity Matrix */}
            <div className="bg-axon-blue/5 p-6 rounded border border-axon-blue/20 overflow-hidden">
              <h3 className="text-sm font-bold mb-6 uppercase tracking-wider flex items-center">
                <Shield className="mr-2 w-4 h-4" /> Matriz de Sensibilidad (ROI %)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] font-mono">
                  <thead>
                    <tr className="text-axon-white/40 border-b border-axon-blue/30">
                      <th className="text-left pb-2 font-normal">BONO \ USD</th>
                      {winner.sensitivity.map(s => <th key={s.dollar} className="text-right pb-2 font-normal">${s.dollar}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-axon-blue/10">
                    {results.map(res => (
                      <tr key={res.symbol} className="hover:bg-axon-blue/10 transition-colors">
                        <td className="py-3 font-bold text-axon-white">{res.symbol}</td>
                        {res.sensitivity.map(s => (
                          <td key={s.dollar} className={`text-right py-3 ${s.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {(s.roi * 100).toFixed(1)}%
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Arbitrage Detail Table */}
          <div className="bg-axon-blue/5 rounded border border-axon-blue/20">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-axon-blue/20 text-axon-white/50 uppercase tracking-widest text-[9px]">
                  <th className="p-4">Instrumento</th>
                  <th className="p-4 text-right">Proyección Pesos</th>
                  <th className="p-4 text-right">ROI c/ Escenario</th>
                  <th className="p-4 text-right">Arbitraje MEP</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-axon-blue/10">
                {results.map(res => (
                  <tr key={res.symbol} className="hover:bg-axon-blue/5">
                    <td className="p-4 font-bold">{res.symbol}</td>
                    <td className="p-4 text-right font-mono">${res.exitPricePesos.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className={`p-4 text-right font-bold ${(res.roiManual * 100) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(res.roiManual * 100).toFixed(2)}%
                    </td>
                    <td className="p-4 text-right text-axon-white/60">
                      {(res.roiMep * 100).toFixed(2)}%
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${res.symbol === winner.symbol ? 'bg-axon-white text-axon-black' : 'bg-axon-blue/40 text-axon-white/40'}`}>
                        {res.symbol === winner.symbol ? 'Top Alpha' : 'Neutral'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
