// Initialize charts when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Fetch scan response data
    fetch('assets/js/scan_response.json')
        .then(response => response.json())
        .then(data => {
            initializeCharts(data);
        })
        .catch(error => console.error('Error loading scan data:', error));
});

function initializeCharts(scanData) {
    createStatusChart(scanData);
    createSeverityChart(scanData);
    createLatencyChart(scanData);
    createTrendChart(scanData);
}

function createStatusChart(data) {
    const statusCounts = data.reduce((acc, item) => {
        const status = item.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    new Chart(document.getElementById('statusChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#4CAF50', // success
                    '#F44336', // failed
                    '#9E9E9E'  // unknown
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createSeverityChart(data) {
    const severityCounts = data.reduce((acc, item) => {
        const severity = item.severity || 'unknown';
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
    }, {});

    new Chart(document.getElementById('severityChart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(severityCounts),
            datasets: [{
                data: Object.values(severityCounts),
                backgroundColor: [
                    '#4CAF50', // low
                    '#FFC107', // medium
                    '#F44336', // high
                    '#9E9E9E'  // unknown
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createLatencyChart(data) {
    const latencyBySeverity = data.reduce((acc, item) => {
        if (item.severity && item.latency) {
            if (!acc[item.severity]) {
                acc[item.severity] = {
                    sum: 0,
                    count: 0
                };
            }
            acc[item.severity].sum += item.latency;
            acc[item.severity].count += 1;
        }
        return acc;
    }, {});

    const severities = Object.keys(latencyBySeverity);
    const avgLatencies = severities.map(severity => 
        latencyBySeverity[severity].sum / latencyBySeverity[severity].count
    );

    new Chart(document.getElementById('latencyChart'), {
        type: 'bar',
        data: {
            labels: severities,
            datasets: [{
                label: 'Average Latency (ms)',
                data: avgLatencies,
                backgroundColor: [
                    '#4CAF50', // low
                    '#FFC107', // medium
                    '#F44336'  // high
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Latency (ms)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createTrendChart(data) {
    // Group scans by date
    const scansByDate = data.reduce((acc, item) => {
        if (item.created_at) {
            const date = item.created_at.split('T')[0];
            if (!acc[date]) {
                acc[date] = {
                    total: 0,
                    success: 0,
                    failed: 0
                };
            }
            acc[date].total += 1;
            if (item.status === 'success') {
                acc[date].success += 1;
            } else if (item.status === 'failed') {
                acc[date].failed += 1;
            }
        }
        return acc;
    }, {});

    const dates = Object.keys(scansByDate).sort();
    const totalScans = dates.map(date => scansByDate[date].total);
    const successScans = dates.map(date => scansByDate[date].success);
    const failedScans = dates.map(date => scansByDate[date].failed);

    new Chart(document.getElementById('trendChart'), {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Total Scans',
                    data: totalScans,
                    borderColor: '#2196F3',
                    tension: 0.1
                },
                {
                    label: 'Successful Scans',
                    data: successScans,
                    borderColor: '#4CAF50',
                    tension: 0.1
                },
                {
                    label: 'Failed Scans',
                    data: failedScans,
                    borderColor: '#F44336',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Scans'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}
