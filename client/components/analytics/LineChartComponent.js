import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ data, dataKey = 'count', xAxisKey = 'date', lineColor = '#00FF9D' }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
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
          dataKey={xAxisKey} 
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
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={lineColor} 
          strokeWidth={2}
          dot={{ fill: lineColor, stroke: lineColor, strokeWidth: 2, r: 4 }}
          activeDot={{ fill: lineColor, stroke: '#fff', strokeWidth: 2, r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
