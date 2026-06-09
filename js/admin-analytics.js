// ===========================
// ADMIN ANALYTICS
// Real-time statistics and charts from localStorage
// ===========================

// Get real user count from localStorage
function getRealUserCount() {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const item = localStorage.getItem(key);

        try {
            const parsed = JSON.parse(item);
            // Check if it's a user object (has name, email, password)
            if (parsed && parsed.email && parsed.password && parsed.name) {
                count++;
            }
        } catch (e) {
            // Not JSON, skip
        }
    }
    return count;
}

// Get projects from localStorage
function getProjects() {
    const projectsData = localStorage.getItem('adminProjects');
    if (projectsData) {
        try {
            return JSON.parse(projectsData);
        } catch (e) {
            return [];
        }
    }
    return [];
}

// Calculate total revenue from projects
function getTotalRevenue() {
    const projects = getProjects();
    const total = projects.reduce((sum, project) => {
        return sum + (parseFloat(project.budget) || 0);
    }, 0);

    // Format as Indian currency
    if (total >= 10000000) {
        return `₹${(total / 10000000).toFixed(1)}Cr`;
    } else if (total >= 100000) {
        return `₹${(total / 100000).toFixed(1)}L`;
    } else if (total >= 1000) {
        return `₹${(total / 1000).toFixed(1)}K`;
    }
    return `₹${total}`;
}

// Get active projects count
function getActiveProjectsCount() {
    const projects = getProjects();
    return projects.filter(p => p.status === 'In Progress').length;
}

// Update stats grid with real data
function updateStatsGrid() {
    const userCount = getRealUserCount();
    const projects = getProjects();
    const activeProjects = getActiveProjectsCount();
    const revenue = getTotalRevenue();

    const statsHTML = `
        <div class="stat-card">
            <div class="icon-box users">
                <i class="fa-solid fa-users"></i>
            </div>
            <div>
                <h3 class="counter" data-target="${userCount}">${userCount}</h3>
                <p>Total Users</p>
            </div>
        </div>

        <div class="stat-card">
            <div class="icon-box projects">
                <i class="fa-solid fa-building"></i>
            </div>
            <div>
                <h3 class="counter" data-target="${projects.length}">${projects.length}</h3>
                <p>Total Projects</p>
            </div>
        </div>

        <div class="stat-card">
            <div class="icon-box bookings">
                <i class="fa-solid fa-calendar-check"></i>
            </div>
            <div>
                <h3 class="counter" data-target="${activeProjects}">${activeProjects}</h3>
                <p>Active Projects</p>
            </div>
        </div>

        <div class="stat-card">
            <div class="icon-box revenue">
                <i class="fa-solid fa-indian-rupee-sign"></i>
            </div>
            <div>
                <h3>${revenue}</h3>
                <p>Total Revenue</p>
            </div>
        </div>
    `;

    document.getElementById('stats-grid').innerHTML = statsHTML;
}

// Initialize Revenue Chart (Dashboard)
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    const projects = getProjects();

    // Group projects by month
    const monthlyRevenue = {
        'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0
    };

    projects.forEach(project => {
        if (project.createdAt) {
            const month = new Date(project.createdAt).toLocaleString('default', { month: 'short' });
            if (monthlyRevenue.hasOwnProperty(month)) {
                monthlyRevenue[month] += parseFloat(project.budget) || 0;
            }
        }
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(monthlyRevenue),
            datasets: [{
                label: 'Revenue (₹)',
                data: Object.values(monthlyRevenue),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
                    }
                }
            }
        }
    });
}

// Initialize User Growth Chart (Analytics Page)
function initUserGrowthChart() {
    const ctx = document.getElementById('userGrowthChart');
    if (!ctx) return;

    // Simulated user growth data
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New Users',
                data: [12, 19, 25, 31, 38, 45],
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                borderColor: '#2563eb',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize Project Status Chart (Analytics Page)
function initProjectStatusChart() {
    const ctx = document.getElementById('projectStatusChart');
    if (!ctx) return;

    const projects = getProjects();
    const statusCounts = {
        'Planning': 0,
        'In Progress': 0,
        'Completed': 0
    };

    projects.forEach(project => {
        if (statusCounts.hasOwnProperty(project.status)) {
            statusCounts[project.status]++;
        }
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    'rgba(251, 191, 36, 0.8)',  // Planning - Yellow
                    'rgba(37, 99, 235, 0.8)',   // In Progress - Blue
                    'rgba(34, 197, 94, 0.8)'    // Completed - Green
                ],
                borderColor: [
                    '#fbbf24',
                    '#2563eb',
                    '#22c55e'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Initialize Advanced Revenue Chart (Analytics Page)
function initAdvancedRevenueChart() {
    const ctx = document.getElementById('revenueChartAdvanced');
    if (!ctx) return;

    const projects = getProjects();

    // Group by month with actual and projected data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const actual = [0, 0, 0, 0, 0, 0];

    projects.forEach(project => {
        if (project.createdAt) {
            const monthIndex = new Date(project.createdAt).getMonth();
            if (monthIndex < 6) {
                actual[monthIndex] += parseFloat(project.budget) || 0;
            }
        }
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Actual Revenue',
                data: actual,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
                    }
                }
            }
        }
    });
}

// Initialize all charts based on visible section
function initCharts() {
    // Always init dashboard chart
    initRevenueChart();

    // Check if analytics section is visible
    const analyticsSection = document.getElementById('analytics-section');
    if (analyticsSection && analyticsSection.classList.contains('active')) {
        initUserGrowthChart();
        initProjectStatusChart();
        initAdvancedRevenueChart();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateStatsGrid();
    initCharts();

    // Re-initialize analytics charts when switching to analytics section
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            if (section === 'analytics') {
                setTimeout(() => {
                    initUserGrowthChart();
                    initProjectStatusChart();
                    initAdvancedRevenueChart();
                }, 100);
            }
        });
    });
});
