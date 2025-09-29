import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns';

const SpendingChart = ({ expenses }) => {
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', '3months'

  const getChartData = () => {
    const now = new Date();
    let startDate, endDate;

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
        endDate = now;
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case '3months':
        startDate = startOfMonth(subMonths(now, 2));
        endDate = endOfMonth(now);
        break;
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    }

    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    if (timeRange === '3months') {
      // Group by month
      const monthlyData = {};
      filteredExpenses.forEach(expense => {
        const month = format(new Date(expense.date), 'MMM yyyy');
        monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
      });

      return {
        categories: Object.keys(monthlyData),
        series: [{
          name: 'Spending',
          data: Object.values(monthlyData)
        }]
      };
    } else {
      // Group by day
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      const dailyData = {};
      
      days.forEach(day => {
        const dayKey = format(day, 'MMM d');
        dailyData[dayKey] = 0;
      });

      filteredExpenses.forEach(expense => {
        const dayKey = format(new Date(expense.date), 'MMM d');
        if (dailyData.hasOwnProperty(dayKey)) {
          dailyData[dayKey] += expense.amount;
        }
      });

      return {
        categories: Object.keys(dailyData),
        series: [{
          name: 'Spending',
          data: Object.values(dailyData)
        }]
      };
    }
  };

  const chartData = getChartData();

  const chartOptions = {
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#3b82f6'],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        },
        formatter: (value) => `$${value.toFixed(0)}`
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toFixed(2)}`
      }
    },
    legend: { show: false }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Spending Trend</CardTitle>
          <div className="flex space-x-1">
            <Button
              variant={timeRange === 'week' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('week')}
            >
              7D
            </Button>
            <Button
              variant={timeRange === 'month' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('month')}
            >
              1M
            </Button>
            <Button
              variant={timeRange === '3months' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('3months')}
            >
              3M
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Chart
          options={chartOptions}
          series={chartData.series}
          type="area"
          height={300}
        />
      </CardContent>
    </Card>
  );
};

export default SpendingChart;