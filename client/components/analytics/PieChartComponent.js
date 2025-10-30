import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#00FF9D', '#00E5E1', '#00B5FF', '#9D00FF', '#FF00E5'];

const PieChartComponent = ({ data, dataKey = 'count', nameKey = '_id' }) => {
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
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#111', 
            borderColor: '#333',
            color: '#fff'
          }}
          formatter={(value, name) => [`${value}`, name]}
        />
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
