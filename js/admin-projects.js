// ===========================
// PROJECT MANAGEMENT
// CRUD operations for projects
// ===========================

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

// Save projects to localStorage
function saveProjects(projects) {
    localStorage.setItem('adminProjects', JSON.stringify(projects));
}

// Load and display projects in grid
function loadProjectsGrid() {
    const projects = getProjects();
    const grid = document.getElementById('projectsGrid');

    if (!grid) return;

    if (projects.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-building" style="font-size: 64px; color: #cbd5e1; margin-bottom: 20px;"></i>
                <h3 style="color: #64748b; margin-bottom: 10px;">No Projects Yet</h3>
                <p style="color: #94a3b8;">Click "Add Project" to create your first project</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = projects.map((project, index) => {
        const statusClass = getStatusClass(project.status);
        const statusIcon = getStatusIcon(project.status);

        return `
            <div class="project-card">
                <div class="project-header">
                    <div class="project-category">${project.category}</div>
                    <div class="project-actions">
                        <button class="action-btn edit-btn" onclick="editProject(${index})" title="Edit">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteProject(${index})" title="Delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>

                <h3 class="project-name">${project.name}</h3>

                <div class="project-meta">
                    <div class="meta-item">
                        <i class="fa-solid fa-user"></i>
                        <span>${project.client}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fa-solid fa-indian-rupee-sign"></i>
                        <span>₹${formatBudget(project.budget)}</span>
                    </div>
                </div>

                <div class="project-status ${statusClass}">
                    <i class="fa-solid fa-${statusIcon}"></i>
                    ${project.status}
                </div>

                <div class="project-date">
                    Added: ${formatDate(project.createdAt)}
                </div>
            </div>
        `;
    }).join('');
}

// Get status CSS class
function getStatusClass(status) {
    switch (status) {
        case 'Planning':
            return 'status-planning';
        case 'In Progress':
            return 'status-progress';
        case 'Completed':
            return 'status-completed';
        default:
            return '';
    }
}

// Get status icon
function getStatusIcon(status) {
    switch (status) {
        case 'Planning':
            return 'clock';
        case 'In Progress':
            return 'spinner';
        case 'Completed':
            return 'check-circle';
        default:
            return 'circle';
    }
}

// Format budget
function formatBudget(budget) {
    const num = parseFloat(budget);
    if (num >= 10000000) {
        return (num / 10000000).toFixed(2) + ' Cr';
    } else if (num >= 100000) {
        return (num / 100000).toFixed(2) + ' L';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + ' K';
    }
    return num.toLocaleString('en-IN');
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Add new project
function addProject(event) {
    event.preventDefault();

    const projectData = {
        name: document.getElementById('projectName').value.trim(),
        client: document.getElementById('projectClient').value.trim(),
        category: document.getElementById('projectCategory').value,
        status: document.getElementById('projectStatus').value,
        budget: document.getElementById('projectBudget').value,
        createdAt: new Date().toISOString()
    };

    // Validate
    if (!projectData.name || !projectData.client || !projectData.category || !projectData.budget) {
        alert('Please fill all fields');
        return;
    }

    // Add to projects array
    const projects = getProjects();
    projects.push(projectData);
    saveProjects(projects);

    // Close modal and reset form
    closeModal('addProjectModal');
    document.getElementById('addProjectForm').reset();

    // Reload grid
    loadProjectsGrid();

    // Show notification
    showNotification('Project added successfully!', 'success');

    // Update stats and charts
    if (typeof updateStatsGrid === 'function') {
        updateStatsGrid();
    }
    if (typeof initRevenueChart === 'function') {
        initRevenueChart();
    }
}

// Edit project
function editProject(index) {
    const projects = getProjects();
    const project = projects[index];

    if (!project) {
        alert('Project not found!');
        return;
    }

    // For simplicity, using prompt dialogs
    // In production, you'd want a proper modal
    const newName = prompt('Project Name:', project.name);
    if (newName === null) return;

    const newClient = prompt('Client Name:', project.client);
    if (newClient === null) return;

    const newBudget = prompt('Budget (₹):', project.budget);
    if (newBudget === null) return;

    const newStatus = prompt('Status (Planning/In Progress/Completed):', project.status);
    if (newStatus === null) return;

    // Update project
    projects[index] = {
        ...project,
        name: newName.trim() || project.name,
        client: newClient.trim() || project.client,
        budget: newBudget || project.budget,
        status: newStatus.trim() || project.status
    };

    saveProjects(projects);
    loadProjectsGrid();

    showNotification('Project updated successfully!', 'success');

    // Update stats and charts
    if (typeof updateStatsGrid === 'function') {
        updateStatsGrid();
    }
    if (typeof initRevenueChart === 'function') {
        initRevenueChart();
    }
}

// Delete project
function deleteProject(index) {
    const projects = getProjects();
    const project = projects[index];

    if (!confirm(`Are you sure you want to delete project:\n\n"${project.name}"\n\nThis action cannot be undone.`)) {
        return;
    }

    projects.splice(index, 1);
    saveProjects(projects);
    loadProjectsGrid();

    showNotification('Project deleted successfully!', 'success');

    // Update stats and charts
    if (typeof updateStatsGrid === 'function') {
        updateStatsGrid();
    }
    if (typeof initRevenueChart === 'function') {
        initRevenueChart();
    }
}

// Initialize some sample projects if none exist
function initializeSampleProjects() {
    const projects = getProjects();

    if (projects.length === 0) {
        const sampleProjects = [
            {
                name: 'Modern Villa Design',
                client: 'Mr. Rajesh Kumar',
                category: 'Residential',
                status: 'In Progress',
                budget: '5000000',
                createdAt: new Date(2026, 0, 15).toISOString()
            },
            {
                name: 'Corporate Office Interior',
                client: 'Tech Solutions Pvt Ltd',
                category: 'Commercial',
                status: 'Completed',
                budget: '8500000',
                createdAt: new Date(2026, 1, 20).toISOString()
            },
            {
                name: 'Luxury Apartment Renovation',
                client: 'Mrs. Priya Sharma',
                category: 'Interior',
                status: 'Planning',
                budget: '3500000',
                createdAt: new Date(2026, 2, 10).toISOString()
            },
            {
                name: 'Beach Resort Architecture',
                client: 'Coastal Resorts Ltd',
                category: 'Hospitality',
                status: 'In Progress',
                budget: '25000000',
                createdAt: new Date(2026, 3, 5).toISOString()
            }
        ];

        saveProjects(sampleProjects);
    }
}

// Initialize project management
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sample projects on first load
    initializeSampleProjects();

    // Load projects grid
    loadProjectsGrid();

    // Add project button
    const addProjectBtn = document.getElementById('addProjectBtn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', function() {
            openModal('addProjectModal');
        });
    }

    // Add project form submit
    const addProjectForm = document.getElementById('addProjectForm');
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', addProject);
    }
});
