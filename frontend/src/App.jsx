import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis
} from 'recharts';
import { Shield, Zap, BarChart3, Settings2, DollarSign, Calculator } from 'lucide-react';

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

  if (!data) return (
    <div className="bg-axon-black min-h-screen text-axon-white flex items-center justify-center font-mono uppercase tracking-[0.2em]">
      Iniciando EcoFlow V2.0 Terminal...
    </div>
  );

  const results = data.results.map(r => ({
    ...r,
    // Add daysToMaturity from bond data if not in result
    daysToMaturity: r.symbol === 'TX26' ? 730 : r.symbol === 'T2X4' ? 150 : 2190
  }));

  const winner = [...results].sort((a, b) => b.roiManual - a.roiManual)[0];

  return (
    <div className="min-h-screen bg-axon-black text-axon-white font-sans p-6 selection:bg-axon-white selection:text-axon-black">
      {/* Header Estilo Terminal Financiera */}
      <header className="flex justify-between items-end mb-8 border-b border-axon-blue/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Zap className="text-axon-white w-8 h-8" fill="white" />
            <h1 className="text-4xl font-title font-bold tracking-tighter uppercase italic">
              ECOFLOW <span className="text-axon-white/30 not-italic ml-1">V2.0</span>
            </h1>
          </div>
          <p className="text-[10px] text-axon-white/40 uppercase tracking-[0.3em] font-medium">
            Sovereign Arbitrage & Carry Engine // Institutional Grade
          </p>
        </div>

        <div className="flex gap-8">
          <div className="border-l border-axon-blue/30 pl-6">
            <p className="text-[9px] text-axon-white/40 uppercase mb-1 font-mono">Dólar MEP Spot</p>
            <p className="text-xl font-mono font-bold tracking-tight">${data.market.MEP.toFixed(2)}</p>
          </div>
          <div className="border-l border-axon-blue/30 pl-6">
            <p className="text-[9px] text-axon-white/40 uppercase mb-1 font-mono">Dólar Oficial (Proj)</p>
            <p className="text-xl font-mono font-bold tracking-tight">${data.market.PROJECTED_OFFICIAL.toFixed(2)}</p>
          </div>
          <div className="border-l border-axon-blue/30 pl-6 hidden md:block">
            <p className="text-[9px] text-axon-white/40 uppercase mb-1 font-mono">Dólar Futuro (Market)</p>
            <p className="text-xl font-mono font-bold tracking-tight">${data.market.FUTURE.toFixed(2)}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar de Parámetros */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-axon-blue/10 p-6 rounded-sm border border-axon-blue/40 shadow-2xl backdrop-blur-sm">
            <h3 className="text-xs font-bold mb-8 flex items-center uppercase tracking-[0.2em] text-axon-white/80">
              <Settings2 className="mr-3 w-4 h-4 text-axon-white" /> Configuración
            </h3>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-[10px] uppercase font-bold text-axon-white/60 tracking-widest">Días de Carry</label>
                  <span className="text-xs font-mono text-axon-white bg-axon-blue px-2 py-0.5 rounded">{days}d</span>
                </div>
                <input
                  type="range" min="0" max="365" value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="w-full accent-axon-white h-[2px] bg-axon-blue/50 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-axon-white/60 tracking-widest mb-3">Escenario USD Manual</label>
                <div className="relative group">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-axon-white/20 group-focus-within:text-axon-white transition-colors" />
                  <input
                    type="number" value={manualDollar}
                    onChange={(e) => setManualDollar(parseInt(e.target.value))}
                    className="w-full bg-axon-black border border-axon-blue/40 rounded-sm py-3 pl-10 pr-4 text-sm font-mono focus:outline-none focus:border-axon-white focus:ring-1 focus:ring-axon-white transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-axon-white p-6 rounded-sm shadow-2xl">
            <h3 className="text-[9px] uppercase tracking-[0.2em] text-axon-black/50 font-bold mb-4">Recomendación Alpha</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-title font-black text-axon-black tracking-tighter">{winner.symbol}</span>
              <Shield className="w-6 h-6 text-axon-black" fill="black" />
            </div>
            <div className="text-axon-black font-mono text-lg font-bold leading-none">
              +{(winner.roiManual * 100).toFixed(2)}% <span className="text-xs font-normal">ROI</span>
            </div>
            <p className="text-[9px] text-axon-black/40 mt-4 leading-relaxed font-medium uppercase italic">
              Escenario proyectado a {days} días con salida en ${manualDollar}.
            </p>
          </div>
        </div>

        {/* Dash Principal */}
        <div className="lg:col-span-9 space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Opportunity Chart */}
            <div className="bg-axon-blue/5 p-8 rounded-sm border border-axon-blue/20 shadow-inner">
              <h3 className="text-xs font-bold mb-8 uppercase tracking-[0.2em] flex items-center text-axon-white/70">
                <BarChart3 className="mr-3 w-4 h-4" /> Mapa de Arbitraje (X=Días)
              </h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A283E" vertical={false} opacity={0.3} />
                    <XAxis
                      type="number" dataKey="daysToMaturity" name="Días" stroke="#F6F7F6" fontSize={9} fontWeight={700}
                      label={{ value: 'DÍAS AL VENCIMIENTO', position: 'insideBottom', offset: -15, fill: '#F6F7F6', fontSize: 8, fontWeight: 700, letterSpacing: 2 }}
                      tick={{fill: '#F6F7F6', opacity: 0.5}}
                    />
                    <YAxis
                      type="number" dataKey="roiManual" name="ROI" stroke="#F6F7F6" fontSize={9} fontWeight={700}
                      tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                      label={{ value: 'ROI ESTIMADO %', angle: -90, position: 'insideLeft', offset: 0, fill: '#F6F7F6', fontSize: 8, fontWeight: 700, letterSpacing: 2 }}
                      tick={{fill: '#F6F7F6', opacity: 0.5}}
                    />
                    <ZAxis type="number" range={[150, 150]} />
                    <Tooltip
                      cursor={{ strokeDasharray: '4 4', stroke: '#F6F7F6', strokeOpacity: 0.5 }}
                      contentStyle={{ backgroundColor: '#0D1A29', border: '1px solid #1A283E', fontSize: '11px', borderRadius: '0px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                      itemStyle={{ color: '#F6F7F6', fontWeight: 'bold' }}
                      formatter={(v, n) => n === 'ROI' ? `${(v * 100).toFixed(2)}%` : v}
                    />
                    <Scatter name="Instrumentos" data={results}>
                      {results.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.symbol === winner.symbol ? '#F6F7F6' : '#1A283E'} stroke={entry.symbol === winner.symbol ? '#0D1A29' : 'transparent'} strokeWidth={2} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sensitivity Matrix */}
            <div className="bg-axon-blue/5 p-8 rounded-sm border border-axon-blue/20 shadow-inner">
              <h3 className="text-xs font-bold mb-8 uppercase tracking-[0.2em] flex items-center text-axon-white/70">
                <Calculator className="mr-3 w-4 h-4" /> Matriz de Sensibilidad
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] font-mono border-collapse">
                  <thead>
                    <tr className="text-axon-white/30 uppercase tracking-widest border-b border-axon-blue/40">
                      <th className="text-left pb-4 font-bold">BONO \ USD</th>
                      {winner.sensitivity.map(s => <th key={s.dollar} className="text-right pb-4 px-2 font-bold">${s.dollar}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-axon-blue/10">
                    {results.map(res => (
                      <tr key={res.symbol} className="hover:bg-axon-blue/10 transition-colors group">
                        <td className="py-4 font-black text-axon-white text-xs">{res.symbol}</td>
                        {res.sensitivity.map(s => (
                          <td key={s.dollar} className={`text-right py-4 px-2 font-bold ${s.roi >= 0 ? 'text-green-400' : 'text-red-400'} ${s.dollar === manualDollar ? 'bg-axon-blue/30 border-x border-axon-blue/50' : ''}`}>
                            {(s.roi * 100).toFixed(1)}%
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex gap-4 text-[9px] text-axon-white/20 uppercase font-bold italic">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-400"></div> Positivo</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-400"></div> Negativo</span>
              </div>
            </div>
          </div>

          {/* Table Detail */}
          <div className="bg-axon-blue/5 rounded-sm border border-axon-blue/20 shadow-inner overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono">
                <thead>
                  <tr className="bg-axon-blue/20 text-axon-white/40 uppercase tracking-[0.2em] font-bold">
                    <th className="p-5">Instrumento</th>
                    <th className="p-5 text-right">Precio Salida (Proj)</th>
                    <th className="p-5 text-right">Oficial Proyectado</th>
                    <th className="p-5 text-right">ROI Escenario</th>
                    <th className="p-5 text-right">Arbitraje MEP</th>
                    <th className="p-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-axon-blue/20">
                  {results.map(res => (
                    <tr key={res.symbol} className={`hover:bg-axon-blue/10 transition-all ${res.symbol === winner.symbol ? 'bg-axon-blue/5' : ''}`}>
                      <td className="p-5 font-black text-xs text-axon-white">{res.symbol}</td>
                      <td className="p-5 text-right text-axon-white/80">${res.exitPricePesos.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className="p-5 text-right text-axon-white/60">${res.projectedOfficial.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className={`p-5 text-right font-black text-xs ${(res.roiManual * 100) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(res.roiManual * 100).toFixed(2)}%
                      </td>
                      <td className="p-5 text-right text-axon-white/40 font-bold">
                        {(res.roiMep * 100).toFixed(2)}%
                      </td>
                      <td className="p-5 text-right">
                        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest italic ${res.symbol === winner.symbol ? 'bg-axon-white text-axon-black' : 'text-axon-white/30'}`}>
                          {res.symbol === winner.symbol ? 'TOP ALPHA' : 'NEUTRAL'}
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
    </div>
  );
};

export default App;
