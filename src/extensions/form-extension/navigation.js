// Navigation styles and creation function
const navigationStyles = `
  .layout-container {
    display: flex;
    min-height: 100vh;
  }

  .nav-bar {
    width: 200px;
    background: #2c3e50;
    padding: 20px 0;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
  }

  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .nav-item {
    color: #ecf0f1;
    padding: 12px 20px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    border-left: 4px solid transparent;
  }

  .nav-item:hover {
    background: #34495e;
    border-left-color: #3498db;
  }

  .nav-item.active {
    background: #34495e;
    border-left-color: #3498db;
  }

  .main-content {
    flex: 1;
    margin-left: 200px;
    padding: 20px;
  }
`;

function createNavigation(currentPage) {
  const pages = [
    { id: 'form', title: 'Contact Form' },
    { id: 'new-submission', title: 'New Submission' },
    { id: 'submissions', title: 'View Submissions' }
  ];

  const navItems = pages.map(page => `
    <li class="nav-item ${currentPage === page.id ? 'active' : ''}"
        onclick="navigate('${page.id}')">
      ${page.title}
    </li>
  `).join('');

  return `
    <div class="layout-container">
      <nav class="nav-bar">
        <ul class="nav-list">
          ${navItems}
        </ul>
      </nav>
      <div class="main-content">
`;
}

module.exports = {
  navigationStyles,
  createNavigation
}; 