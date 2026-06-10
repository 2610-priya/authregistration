/**
 * Dashboard Controller
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Guard page: if user session does not exist, redirect immediately to login.html
  session.guardDashboard();

  // Get current active session
  const currentUser = session.get();
  if (!currentUser) return; // Exit if redirecting

  // DOM Elements
  const sidebarUsername = document.getElementById('sidebar-username');
  const welcomeUsername = document.getElementById('welcome-username');
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  const totalUsersLabel = document.getElementById('stats-total-users');
  const dashboardDate = document.getElementById('dashboard-date');
  const logoutBtn = document.getElementById('btn-logout');

  // Responsive Drawer Elements
  const sidebar = document.getElementById('dashboard-sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarToggleBtn = document.getElementById('btn-sidebar-toggle');

  /* ==========================================
     POPULATE PERSONALIZED INFO
     ========================================== */
  
  // Set Usernames (Support both local mock name and backend fullName)
  const displayName = currentUser.fullName || currentUser.name || 'User';
  sidebarUsername.textContent = displayName;
  welcomeUsername.textContent = displayName;

  // Set Profile Avatar Initials
  const nameParts = displayName.trim().split(' ');
  let initials = '?';
  if (nameParts.length > 0) {
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() : '';
    initials = firstInitial + lastInitial;
  }
  sidebarAvatar.textContent = initials;

  // Set Actual Total Users Registered in MongoDB Database (Async API Call)
  const registeredUsersCount = await db.getTotalUsersCount();
  totalUsersLabel.textContent = registeredUsersCount;

  // Format and Display Current Date
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date();
  dashboardDate.textContent = today.toLocaleDateString('en-US', options);

  /* ==========================================
     MOBILE SIDEBAR DRAWERS
     ========================================== */
  function openMobileSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
  }

  function closeMobileSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  }

  sidebarToggleBtn.addEventListener('click', openMobileSidebar);
  sidebarOverlay.addEventListener('click', closeMobileSidebar);

  // Close sidebar drawer if layout window scales larger than mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
      closeMobileSidebar();
    }
  });

  /* ==========================================
     LOGOUT HANDLER
     ========================================== */
  logoutBtn.addEventListener('click', () => {
    // Add logout visual indication state
    sidebarUsername.textContent = 'Logging out...';
    
    setTimeout(() => {
      // Clear session store
      session.destroy();
      // Redirect to login
      window.location.replace('login.html');
    }, 800);
  });
});
