// Initialize charts when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Fetch scan response data
    fetch('http://localhost:9001/rule-execution-results?skip=0&limit=1000')
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data)) {
                initializeCharts(data);
            } else {
                console.error('Invalid data format received');
            }
        })
        .catch(error => console.error('Error loading scan data:', error));
});

function initializeCharts(scanData) {
    try {
        createStatusChart(scanData);
        createSeverityChart(scanData);
        createLatencyChart(scanData);
        createTrendChart(scanData);
        createRuleDistributionChart(scanData);
        createAgentPerformanceChart(scanData);
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function createStatusChart(data) {
    if (!data || !Array.isArray(data)) return;

    const statusCounts = data.reduce((acc, item) => {
        const status = (item && item.status) || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const ctx = document.getElementById('statusChart');
    if (!ctx) return;

    new Chart(ctx, {
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
    if (!data || !Array.isArray(data)) return;

    const severityCounts = data.reduce((acc, item) => {
        const severity = (item && item.severity) || 'unknown';
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
    }, {});

    const ctx = document.getElementById('severityChart');
    if (!ctx) return;

    new Chart(ctx, {
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
    if (!data || !Array.isArray(data)) return;

    const latencyBySeverity = data.reduce((acc, item) => {
        if (item && item.severity && item.latency) {
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

    const ctx = document.getElementById('latencyChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: severities,
            datasets: [{
                label: 'Average Latency (ms)',
                data: avgLatencies,
                backgroundColor: '#2196F3'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
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

function createTrendChart(data) {
    if (!data || !Array.isArray(data)) return;

    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
    );

    // Group scans by date
    const scansByDate = sortedData.reduce((acc, item) => {
        if (item && item.created_at) {
            const date = new Date(item.created_at).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = {
                    total: 0,
                    success: 0
                };
            }
            acc[date].total += 1;
            if (item.status === 'success') {
                acc[date].success += 1;
            }
        }
        return acc;
    }, {});

    const dates = Object.keys(scansByDate);
    const totalScans = dates.map(date => scansByDate[date].total);
    const successfulScans = dates.map(date => scansByDate[date].success);

    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Total Scans',
                    data: totalScans,
                    borderColor: '#2196F3',
                    fill: false
                },
                {
                    label: 'Successful Scans',
                    data: successfulScans,
                    borderColor: '#4CAF50',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
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

function createRuleDistributionChart(data) {
    if (!data || !Array.isArray(data)) return;

    // Count occurrences of each rule
    const ruleStats = data.reduce((acc, item) => {
        if (item && item.rule_name) {
            if (!acc[item.rule_name]) {
                acc[item.rule_name] = {
                    total: 0,
                    matches: 0
                };
            }
            acc[item.rule_name].total += 1;
            if (item.rule_match) {
                acc[item.rule_name].matches += 1;
            }
        }
        return acc;
    }, {});

    const rules = Object.keys(ruleStats);
    const totalScans = rules.map(rule => ruleStats[rule].total);
    const matchedScans = rules.map(rule => ruleStats[rule].matches);

    const ctx = document.getElementById('ruleDistributionChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: rules,
            datasets: [
                {
                    label: 'Total Scans',
                    data: totalScans,
                    backgroundColor: '#2196F3'
                },
                {
                    label: 'Rule Matches',
                    data: matchedScans,
                    backgroundColor: '#F44336'
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

function createAgentPerformanceChart(data) {
    if (!data || !Array.isArray(data)) return;

    // Analyze agent performance
    const agentStats = data.reduce((acc, item) => {
        if (item && item.agent_ip) {
            if (!acc[item.agent_ip]) {
                acc[item.agent_ip] = {
                    total: 0,
                    success: 0,
                    avgLatency: 0,
                    totalLatency: 0
                };
            }
            acc[item.agent_ip].total += 1;
            if (item.status === 'success') {
                acc[item.agent_ip].success += 1;
            }
            if (item.latency) {
                acc[item.agent_ip].totalLatency += item.latency;
            }
        }
        return acc;
    }, {});

    // Calculate success rates and average latencies
    Object.keys(agentStats).forEach(agent => {
        const stats = agentStats[agent];
        stats.successRate = (stats.success / stats.total) * 100;
        stats.avgLatency = stats.totalLatency / stats.total;
    });

    const agents = Object.keys(agentStats);
    const successRates = agents.map(agent => agentStats[agent].successRate);
    const avgLatencies = agents.map(agent => agentStats[agent].avgLatency);

    const ctx = document.getElementById('agentPerformanceChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Agent Performance',
                data: agents.map((agent, index) => ({
                    x: successRates[index],
                    y: avgLatencies[index],
                    agent: agent
                })),
                backgroundColor: '#4CAF50'
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Success Rate (%)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Average Latency (ms)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const point = context.raw;
                            return `Agent: ${point.agent}\nSuccess Rate: ${point.x.toFixed(1)}%\nLatency: ${point.y.toFixed(0)}ms`;
                        }
                    }
                }
            }
        }
    });
}