import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#00FF9D', '#00E5E1', '#00B5FF', '#9D00FF', '#FF00E5'];

const PieChartComponent = ({ data, dataKey = 'count', nameKey = '_id' }) => {
  const renderTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload || {};
      const name = p[nameKey] ?? payload[0].name ?? '';
      const value = p[dataKey] ?? payload[0].value ?? 0;
      return (
        <div style={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff', padding: '6px 8px', borderRadius: 8 }}>
          <div style={{ fontSize: 12 }}>{String(name)}</div>
          <div style={{ fontWeight: 600 }}>{String(value)}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={renderTooltip} />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          formatter={(value) => <span style={{ color: '#ccc' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
