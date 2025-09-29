import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';

const CategoryChart = ({ expenses }) => {
  const getCategoryData = () => {
    const categoryTotals = {};
    
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8); // Top 8 categories

    return {
      labels: sortedCategories.map(([category]) => category),
      series: sortedCategories.map(([, amount]) => amount)
    };
  };

  const categoryData = getCategoryData();

  const chartOptions = {
    chart: {
      type: 'donut',
      height: 300
    },
    colors: [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
      '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
    ],
    labels: categoryData.labels,
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`
    },
    legend: {
      position: 'bottom',
      fontSize: '12px'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Spent',
              formatter: () => {
                const total = categoryData.series.reduce((sum, val) => sum + val, 0);
                return `$${total.toFixed(2)}`;
              }
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toFixed(2)}`
      }
    }
  };

  if (categoryData.series.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-slate-500">
            No spending data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart
          options={chartOptions}
          series={categoryData.series}
          type="donut"
          height={300}
        />
      </CardContent>
    </Card>
  );
};

export default CategoryChart;