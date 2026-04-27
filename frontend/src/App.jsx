import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';
import { TrendingUp, DollarSign, Award, Clock } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, subValue }) => (
  <div className="bg-axon-blue p-6 rounded-lg border border-axon-gray shadow-xl">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-axon-white/70 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <Icon className="text-axon-white w-6 h-6" />
    </div>
    <div className="text-3xl font-bold text-axon-white mb-1">{value}</div>
    {subValue && <div className="text-axon-white/50 text-xs">{subValue}</div>}
  </div>
);

const App = () => {
  const [days, setDays] = useState(30);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (carryDays) => {
    try {
      const response = await axios.get(`/api/data?days=${carryDays}`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(days);
  }, [days]);

  const winner = data.length > 0 ? [...data].sort((a, b) => b.roiPesos - a.roiPesos)[0] : null;

  return (
    <div className="min-h-screen bg-axon-black text-axon-white p-8 font-sans">
      <header className="mb-12">
        <h1 className="text-4xl font-title font-bold mb-2 text-axon-white">Axon Carry Engine <span className="text-axon-white/50 text-xl">V1.2</span></h1>
        <p className="text-axon-white/60">Optimización de carry trade y payoff dinámico de bonos soberanos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        <div className="lg:col-span-1 bg-axon-gray p-6 rounded-lg border border-axon-blue/30">
          <h3 className="flex items-center text-axon-white font-title font-bold mb-6">
            <Clock className="mr-2 w-5 h-5" /> Simulador de Carry
          </h3>
          <label className="block text-sm text-axon-white/70 mb-4">Días de Carry: <span className="text-axon-white font-bold">{days} días</span></label>
          <input
            type="range"
            min="0"
            max="365"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-full h-2 bg-axon-blue rounded-lg appearance-none cursor-pointer accent-axon-white"
          />
          <div className="flex justify-between text-xs text-axon-white/40 mt-2">
            <span>0d</span>
            <span>180d</span>
            <span>365d</span>
          </div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Bono Ganador"
            value={winner?.symbol || 'N/A'}
            icon={Award}
            subValue={`Score: ${winner?.score.toFixed(1)}%`}
          />
          <MetricCard
            title="ROI de Salida"
            value={winner ? `${(winner.roiPesos * 100).toFixed(2)}%` : '0.00%'}
            icon={TrendingUp}
            subValue="Retorno proyectado en pesos"
          />
          <MetricCard
            title="MEP Breakeven"
            value={winner ? `$${winner.mepBreakeven.toFixed(2)}` : '$0.00'}
            icon={DollarSign}
            subValue="Umbral de tipo de cambio"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-axon-gray p-8 rounded-lg border border-axon-blue/20">
          <h3 className="text-xl font-title font-bold mb-6">Gráfico de Eficiencia</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A283E" vertical={false} />
                <XAxis
                  type="number"
                  dataKey="duration"
                  name="Duration"
                  unit="y"
                  stroke="#F6F7F6"
                  label={{ value: 'Duration (Años)', position: 'insideBottom', offset: -10, fill: '#F6F7F6' }}
                />
                <YAxis
                  type="number"
                  dataKey="roiPesos"
                  name="ROI"
                  tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                  stroke="#F6F7F6"
                  label={{ value: 'ROI Proyectado', angle: -90, position: 'insideLeft', fill: '#F6F7F6' }}
                />
                <ZAxis type="number" range={[100, 1000]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0D1A29', border: '1px solid #1A283E', color: '#F6F7F6' }}
                  formatter={(value, name) => name === 'ROI' ? `${(value * 100).toFixed(2)}%` : value}
                />
                <Scatter name="Bonos" data={data} fill="#1A283E">
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.symbol === winner?.symbol ? '#F6F7F6' : '#1A283E'}
                      stroke={entry.symbol === winner?.symbol ? '#F6F7F6' : '#1A283E'}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-axon-gray p-8 rounded-lg border border-axon-blue/20">
          <h3 className="text-xl font-title font-bold mb-6">Detalle de Cartera</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-axon-blue/30 text-axon-white/50 text-sm">
                  <th className="pb-4 font-medium">Bono</th>
                  <th className="pb-4 font-medium text-right">Precio Actual</th>
                  <th className="pb-4 font-medium text-right">Precio Salida</th>
                  <th className="pb-4 font-medium text-right">ROI (%)</th>
                  <th className="pb-4 font-medium text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-axon-blue/10">
                {data.map((bond) => (
                  <tr key={bond.symbol} className="hover:bg-axon-blue/10 transition-colors">
                    <td className="py-4 font-bold">{bond.symbol}</td>
                    <td className="py-4 text-right">${bond.price.toLocaleString()}</td>
                    <td className="py-4 text-right">${bond.exitPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className={`py-4 text-right font-bold ${bond.roiPesos >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(bond.roiPesos * 100).toFixed(2)}%
                    </td>
                    <td className="py-4 text-right">
                      <div className="inline-block px-2 py-1 bg-axon-blue rounded text-xs">
                        {bond.score.toFixed(0)}
                      </div>
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
