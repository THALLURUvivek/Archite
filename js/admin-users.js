// ===========================
// USER MANAGEMENT
// CRUD operations for users from localStorage
// ===========================

// Get all users from localStorage
function getAllUsers() {
    const users = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const item = localStorage.getItem(key);

        try {
            const parsed = JSON.parse(item);
            // Check if it's a user object (has name, email, password, but exclude admin flags)
            if (parsed && parsed.email && parsed.password && parsed.name && !key.includes('admin')) {
                users.push({
                    email: key,  // localStorage key is the email
                    name: parsed.name,
                    createdAt: parsed.createdAt || new Date().toISOString()
                });
            }
        } catch (e) {
            // Not JSON, skip
        }
    }

    return users;
}

// Load and display users in table
function loadUsersTable(searchTerm = '') {
    const users = getAllUsers();
    const tbody = document.getElementById('usersTableBody');

    if (!tbody) return;

    // Filter users based on search
    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return user.name.toLowerCase().includes(searchLower) ||
               user.email.toLowerCase().includes(searchLower);
    });

    if (filteredUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px; color: #64748b;">
                    <i class="fa-solid fa-users" style="font-size: 48px; margin-bottom: 10px; opacity: 0.3;"></i>
                    <p>No users found</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredUsers.map(user => {
        const joinedDate = new Date(user.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        return `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                        <strong>${user.name}</strong>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>${joinedDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" onclick="editUser('${user.email}')" title="Edit User">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteUser('${user.email}')" title="Delete User">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Edit user - open modal with user data
function editUser(email) {
    const userDataStr = localStorage.getItem(email);
    if (!userDataStr) {
        alert('User not found!');
        return;
    }

    try {
        const userData = JSON.parse(userDataStr);

        // Populate form
        document.getElementById('editUserEmail').value = email;
        document.getElementById('editUserName').value = userData.name;
        document.getElementById('editUserEmailDisplay').value = email;

        // Show modal
        openModal('editUserModal');
    } catch (e) {
        alert('Error loading user data');
    }
}

// Save edited user
function saveEditedUser(event) {
    event.preventDefault();

    const email = document.getElementById('editUserEmail').value;
    const newName = document.getElementById('editUserName').value.trim();

    if (!newName) {
        alert('Please enter a name');
        return;
    }

    const userDataStr = localStorage.getItem(email);
    if (!userDataStr) {
        alert('User not found!');
        return;
    }

    try {
        const userData = JSON.parse(userDataStr);
        userData.name = newName;

        // Save back to localStorage
        localStorage.setItem(email, JSON.stringify(userData));

        // Close modal and reload table
        closeModal('editUserModal');
        loadUsersTable();

        // Show success notification
        showNotification('User updated successfully!', 'success');

        // Update stats if they changed
        if (typeof updateStatsGrid === 'function') {
            updateStatsGrid();
        }
    } catch (e) {
        alert('Error updating user');
    }
}

// Delete user
function deleteUser(email) {
    if (!confirm(`Are you sure you want to delete user: ${email}?\n\nThis action cannot be undone.`)) {
        return;
    }

    localStorage.removeItem(email);

    // Reload table
    loadUsersTable();

    // Show success notification
    showNotification('User deleted successfully!', 'success');

    // Update stats
    if (typeof updateStatsGrid === 'function') {
        updateStatsGrid();
    }
}

// Export users to CSV
function exportUsersToCSV() {
    const users = getAllUsers();

    if (users.length === 0) {
        alert('No users to export');
        return;
    }

    // Create CSV content
    let csv = 'Name,Email,Joined Date\n';

    users.forEach(user => {
        const joinedDate = new Date(user.createdAt).toLocaleDateString('en-IN');
        csv += `"${user.name}","${user.email}","${joinedDate}"\n`;
    });

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stackly-users-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification('Users exported successfully!', 'success');
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        // Add animation class
        setTimeout(() => {
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
            modal.querySelector('.modal-content').style.opacity = '1';
        }, 10);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.querySelector('.modal-content').style.transform = 'scale(0.7)';
        modal.querySelector('.modal-content').style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.toast-notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `toast-notification ${type}`;
    notification.innerHTML = `
        <i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize user management
document.addEventListener('DOMContentLoaded', function() {
    // Load users table
    loadUsersTable();

    // Search functionality
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            loadUsersTable(e.target.value);
        });
    }

    // Export users button
    const exportBtn = document.getElementById('exportUsersBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportUsersToCSV);
    }

    // Edit user form submit
    const editForm = document.getElementById('editUserForm');
    if (editForm) {
        editForm.addEventListener('submit', saveEditedUser);
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            const modalId = event.target.id;
            closeModal(modalId);
        }
    });
});
