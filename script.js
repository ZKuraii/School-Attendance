// script.js - simple client-side logic for dummy accounts and role assignment

// Dummy credentials
const ADMIN_EMAIL = 'admin@school.edu';
const ADMIN_PASS = 'admin123';
const STUDENT_EMAIL = 'student@school.edu';
const STUDENT_PASS = 'student123';

document.addEventListener('DOMContentLoaded', () => {
  // Attach handlers if form elements exist
  const adminForm = document.getElementById('adminForm');
  const studentForm = document.getElementById('studentForm');
  const assignForm = document.getElementById('assignForm');

  if (adminForm) {
    adminForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('adminEmail').value.trim();
      const pass = document.getElementById('adminPass').value.trim();
      const msg = document.getElementById('adminMsg');

      if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
        // mark session
        sessionStorage.setItem('currentUser', email);
        sessionStorage.setItem('role', 'admin');
        window.location.href = 'admin-dashboard.html';
      } else {
        msg.textContent = 'Invalid admin credentials.';
      }
    });
  }

  if (studentForm) {
    studentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('studentEmail').value.trim();
      const pass = document.getElementById('studentPass').value.trim();
      const msg = document.getElementById('studentMsg');

      if (email === STUDENT_EMAIL && pass === STUDENT_PASS) {
        // Check assigned roles in localStorage
        const roles = JSON.parse(localStorage.getItem('studentRoles') || '{}');
        if (roles[email]) {
          sessionStorage.setItem('currentUser', email);
          sessionStorage.setItem('role', 'student');
          window.location.href = 'student-dashboard.html';
        } else {
          msg.textContent = 'Your account has no assigned role. Contact your teacher.';
        }
      } else {
        msg.textContent = 'Invalid student credentials.';
      }
    });
  }

  if (assignForm) {
    assignForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('assignEmail').value.trim();
      const role = document.getElementById('assignRole').value.trim();
      if (!email || !role) return;

      const roles = JSON.parse(localStorage.getItem('studentRoles') || '{}');
      roles[email] = role;
      localStorage.setItem('studentRoles', JSON.stringify(roles));
      updateRoleList();
      assignForm.reset();
    });

    // logout button
    const logoutAdmin = document.getElementById('logoutAdmin');
    if (logoutAdmin) {
      logoutAdmin.addEventListener('click', () => {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('role');
        window.location.href = 'index.html';
      });
    }

    updateRoleList();
  }

  // admin-dashboard protection: only allow admin
  if (document.location.pathname.endsWith('admin-dashboard.html')) {
    const current = sessionStorage.getItem('currentUser');
    if (current !== ADMIN_EMAIL) {
      // redirect to admin login
      window.location.href = 'admin-login.html';
    }
  }

  // student-dashboard logic and protection
  if (document.location.pathname.endsWith('student-dashboard.html')) {
    const current = sessionStorage.getItem('currentUser');
    if (!current || current !== STUDENT_EMAIL) {
      window.location.href = 'student-login.html';
    } else {
      const roles = JSON.parse(localStorage.getItem('studentRoles') || '{}');
      const roleText = roles[current] || 'No role assigned';
      document.getElementById('studentRole').textContent = roleText;
      document.getElementById('welcomeLine').textContent = `Hello ${current} — role: ${roleText}`;
      const logoutStudent = document.getElementById('logoutStudent');
      if (logoutStudent) {
        logoutStudent.addEventListener('click', () => {
          sessionStorage.removeItem('currentUser');
          sessionStorage.removeItem('role');
          window.location.href = 'index.html';
        });
      }
    }
  }
});

// utilities
function updateRoleList() {
  const list = document.getElementById('roleList');
  if (!list) return;
  const roles = JSON.parse(localStorage.getItem('studentRoles') || '{}');
  list.innerHTML = '';
  const keys = Object.keys(roles);
  if (keys.length === 0) {
    list.innerHTML = '<li class="muted">No assigned students yet.</li>';
    return;
  }
  keys.forEach(email => {
    const li = document.createElement('li');
    li.innerHTML = `<span style="font-weight:600">${email}</span><small style="opacity:0.9;margin-left:10px">${roles[email]}</small>`;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      const r = JSON.parse(localStorage.getItem('studentRoles') || '{}');
      delete r[email];
      localStorage.setItem('studentRoles', JSON.stringify(r));
      updateRoleList();
    });
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}