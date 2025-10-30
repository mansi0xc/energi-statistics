import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ data, dataKey, nameKey = '_id', barColor = '#00FF9D' }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
        <XAxis 
          dataKey={nameKey} 
          tick={{ fill: '#aaa' }} 
          axisLine={{ stroke: '#555' }}
        />
        <YAxis 
          tick={{ fill: '#aaa' }} 
          axisLine={{ stroke: '#555' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#111', 
            borderColor: '#333',
            color: '#fff'
          }}
          labelStyle={{ color: '#fff' }}
        />
        <Bar 
          dataKey={dataKey} 
          fill={barColor}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
