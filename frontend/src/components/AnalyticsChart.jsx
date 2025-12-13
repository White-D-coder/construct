import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AnalyticsChart = ({ sessions = [] }) => {
    // Process sessions to get daily duration for the last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        return d;
    }).reverse();

    const dataPoints = last7Days.map(date => {
        const daySessions = sessions.filter(s => {
            const sDate = new Date(s.startTime);
            sDate.setHours(0, 0, 0, 0);
            return sDate.getTime() === date.getTime();
        });
        return daySessions.reduce((acc, curr) => acc + curr.duration, 0);
    });

    const labels = last7Days.map(d => d.toLocaleDateString('en-US', { weekday: 'short' }));

    const data = {
        labels,
        datasets: [
            {
                label: 'Study Minutes',
                data: dataPoints,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
                borderRadius: 4,
                hoverBackgroundColor: 'rgba(255, 255, 255, 1)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Weekly Study Activity',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Minutes'
                }
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <Bar options={options} data={data} />
        </div>
    );
};

export default AnalyticsChart;
