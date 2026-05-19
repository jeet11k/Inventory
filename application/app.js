// Frontend application logic for Inventory Management

const API_BASE = '/api';

// State
let currentEditId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadInventory();
  loadSummary();
  attachEventListeners();
});

// Event listeners
function attachEventListeners() {
  // Form submission
  const form = document.querySelector('.item-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Cancel button
  const cancelBtn = document.querySelector('[data-action="cancel"]');
  if (!cancelBtn) {
    const buttons = document.querySelectorAll('button.secondary');
    if (buttons.length > 0) {
      buttons[buttons.length - 1].addEventListener('click', resetForm);
    }
  }

  // Category filter
  const categorySelect = document.querySelector('.filter-row select');
  if (categorySelect) {
    categorySelect.addEventListener('change', filterInventory);
  }

  // Search
  const searchInput = document.querySelector('input[type="search"]');
  if (searchInput) {
    searchInput.addEventListener('input', searchInventory);
  }
}

// Load inventory items
function loadInventory() {
  fetch(`${API_BASE}/inventory`)
    .then(res => res.json())
    .then(items => {
      displayInventory(items);
    })
    .catch(err => console.error('Error loading inventory:', err));
}

// Display inventory in table
function displayInventory(items) {
  const tbody = document.querySelector('tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No items found</td></tr>';
    return;
  }

  items.forEach(item => {
    const row = document.createElement('tr');
    const statusClass = getStatusClass(item.status);
    row.innerHTML = `
      <td>${escapeHtml(item.name)}</td>
      <td>${item.category}</td>
      <td>${item.quantity}</td>
      <td>${escapeHtml(item.location)}</td>
      <td><span class="status ${statusClass}">${item.status}</span></td>
      <td>
        <button onclick="editItem(${item.id})">Edit</button>
        <button class="danger" onclick="deleteItem(${item.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Load and display summary
function loadSummary() {
  fetch(`${API_BASE}/summary`)
    .then(res => res.json())
    .then(summary => {
      displaySummary(summary);
    })
    .catch(err => console.error('Error loading summary:', err));
}

// Display summary cards
function displaySummary(summary) {
  const cards = document.querySelectorAll('.summary-card');
  if (cards.length >= 4) {
    cards[0].querySelector('strong').textContent = summary.total || 0;
    cards[1].querySelector('strong').textContent = summary.laptops || 0;
    cards[2].querySelector('strong').textContent = summary.desktops || 0;
    cards[3].querySelector('strong').textContent = summary.phones || 0;
  }
}

// Edit item
function editItem(id) {
  fetch(`${API_BASE}/inventory/${id}`)
    .then(res => res.json())
    .then(item => {
      populateForm(item);
      currentEditId = id;
      document.getElementById('add-item').scrollIntoView({ behavior: 'smooth' });
    })
    .catch(err => console.error('Error loading item:', err));
}

// Populate form with item data
function populateForm(item) {
  const inputs = document.querySelectorAll('.item-form input, .item-form select, .item-form textarea');
  const form = document.querySelector('.item-form');

  form.querySelector('input[type="text"]').value = item.name;
  form.querySelectorAll('select')[0].value = item.category;
  form.querySelector('input[type="number"]').value = item.quantity;
  form.querySelectorAll('input[type="text"]')[1].value = item.location;
  form.querySelectorAll('select')[1].value = item.status;
  form.querySelector('textarea').value = item.notes || '';
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();

  const form = document.querySelector('.item-form');
  const data = {
    name: form.querySelector('input[type="text"]').value,
    category: form.querySelectorAll('select')[0].value,
    quantity: parseInt(form.querySelector('input[type="number"]').value),
    location: form.querySelectorAll('input[type="text"]')[1].value,
    status: form.querySelectorAll('select')[1].value,
    notes: form.querySelector('textarea').value
  };

  const url = currentEditId ? `${API_BASE}/inventory/${currentEditId}` : `${API_BASE}/inventory`;
  const method = currentEditId ? 'PUT' : 'POST';

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => {
      resetForm();
      loadInventory();
      loadSummary();
    })
    .catch(err => console.error('Error saving item:', err));
}

// Delete item
function deleteItem(id) {
  if (!confirm('Are you sure you want to delete this item?')) return;

  fetch(`${API_BASE}/inventory/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => {
      loadInventory();
      loadSummary();
    })
    .catch(err => console.error('Error deleting item:', err));
}

// Filter inventory by category
function filterInventory(e) {
  const category = e.target.value;
  const searchTerm = document.querySelector('input[type="search"]').value.toLowerCase();

  fetch(`${API_BASE}/inventory`)
    .then(res => res.json())
    .then(items => {
      let filtered = items;
      if (category !== 'all') {
        filtered = items.filter(item => item.category.toLowerCase() === category.toLowerCase());
      }
      if (searchTerm) {
        filtered = filtered.filter(item => item.name.toLowerCase().includes(searchTerm));
      }
      displayInventory(filtered);
    });
}

// Search inventory
function searchInventory(e) {
  const searchTerm = e.target.value.toLowerCase();
  const category = document.querySelector('.filter-row select').value;

  fetch(`${API_BASE}/inventory`)
    .then(res => res.json())
    .then(items => {
      let filtered = items.filter(item => item.name.toLowerCase().includes(searchTerm));
      if (category !== 'all') {
        filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
      }
      displayInventory(filtered);
    });
}

// Reset form
function resetForm() {
  document.querySelector('.item-form').reset();
  currentEditId = null;
}

// Helper functions
function getStatusClass(status) {
  const statusMap = {
    'Available': 'available',
    'Assigned': 'assigned',
    'In Repair': 'repair'
  };
  return statusMap[status] || 'available';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
