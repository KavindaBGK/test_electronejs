const createContactForm = require('./pages/ContactForm');
const createSubmissionForm = require('./pages/SubmissionForm');
const createSubmissionsList = require('./pages/SubmissionsList');

// Extension entry point
function activate(context) {
  console.log('Form Extension activated');
  
  // Initialize state using extension context
  const state = {
    currentPage: 'contact',
    submissions: []
  };

  // Create the webview panel
  const panel = context.createWebviewPanel(
    'formExtension',
    'Form Extension',
    'main',
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );

  function getPageContent() {
    switch (state.currentPage) {
      case 'contact':
        return createContactForm();
      case 'submission':
        return createSubmissionForm();
      case 'submissions':
        return createSubmissionsList(state.submissions);
      default:
        return createContactForm();
    }
  }

  function updateContent() {
    panel.webview.html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background: #f5f6fa;
            }
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
              z-index: 100;
            }
            .nav-list {
              list-style: none;
              margin: 0;
              padding: 0;
            }
            .nav-item {
              color: #ecf0f1;
              padding: 12px 20px;
              cursor: pointer;
              transition: all 0.2s;
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
              position: relative;
            }
            .page-content {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .form-group {
              margin-bottom: 15px;
            }
            label {
              display: block;
              margin-bottom: 5px;
              font-weight: bold;
            }
            input, textarea, select {
              width: 100%;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
              box-sizing: border-box;
            }
            select {
              background-color: white;
            }
            button {
              background: #3498db;
              color: white;
              padding: 10px 20px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
            }
            button:hover {
              background: #2980b9;
            }
            .submissions-list {
              display: grid;
              gap: 20px;
            }
            .submission-card {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .card-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
            }
            .card-header h3 {
              margin: 0;
              color: #2c3e50;
            }
            .badge {
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            }
            .badge.high { background: #e74c3c; color: white; }
            .badge.medium { background: #f39c12; color: white; }
            .badge.low { background: #27ae60; color: white; }
            .badge.contact { background: #3498db; color: white; }
            .card-content {
              margin-bottom: 15px;
            }
            .card-footer {
              border-top: 1px solid #eee;
              padding-top: 10px;
            }
            .submission-time {
              color: #666;
              font-size: 0.9em;
            }
            .empty-state {
              text-align: center;
              padding: 40px;
              color: #666;
            }
            h2 {
              text-align: center;
              color: #2c3e50;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="layout-container">
            <nav class="nav-bar">
              <ul class="nav-list">
                <li class="nav-item ${state.currentPage === 'contact' ? 'active' : ''}" 
                    data-page="contact"
                    onclick="handleNavigation('contact')">
                  Contact Form
                </li>
                <li class="nav-item ${state.currentPage === 'submission' ? 'active' : ''}"
                    data-page="submission"
                    onclick="handleNavigation('submission')">
                  New Issue
                </li>
                <li class="nav-item ${state.currentPage === 'submissions' ? 'active' : ''}"
                    data-page="submissions"
                    onclick="handleNavigation('submissions')">
                  View All
                </li>
              </ul>
            </nav>
            <main class="main-content">
              ${getPageContent()}
            </main>
          </div>

          <script>
            // Page content creation functions
            function createContactForm() {
              return '<div class="page-content">' +
                '<h2>Contact Form</h2>' +
                '<form id="contactForm" class="contact-form">' +
                  '<div class="form-group">' +
                    '<label for="name">Name:</label>' +
                    '<input type="text" id="name" name="name" required>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<label for="email">Email:</label>' +
                    '<input type="email" id="email" name="email" required>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<label for="phone">Phone:</label>' +
                    '<input type="tel" id="phone" name="phone" required>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<label for="message">Message:</label>' +
                    '<textarea id="message" name="message" rows="4" required></textarea>' +
                  '</div>' +
                  '<button type="submit">Submit</button>' +
                '</form>' +
              '</div>';
            }

            function createSubmissionForm() {
              return '<div class="page-content">' +
                '<h2>New Issue</h2>' +
                '<form id="submissionForm" class="submission-form">' +
                  '<div class="form-group">' +
                    '<label for="title">Title:</label>' +
                    '<input type="text" id="title" name="title" required>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<label for="category">Category:</label>' +
                    '<select id="category" name="category" required>' +
                      '<option value="">Select a category</option>' +
                      '<option value="bug">Bug</option>' +
                      '<option value="feature">Feature Request</option>' +
                      '<option value="improvement">Improvement</option>' +
                      '<option value="question">Question</option>' +
                    '</select>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<label for="priority">Priority:</label>' +
                    '<select id="priority" name="priority" required>' +
                      '<option value="">Select priority</option>' +
                      '<option value="high">High</option>' +
                      '<option value="medium">Medium</option>' +
                      '<option value="low">Low</option>' +
                    '</select>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<label for="description">Description:</label>' +
                    '<textarea id="description" name="description" rows="4" required></textarea>' +
                  '</div>' +
                  '<button type="submit">Submit</button>' +
                '</form>' +
              '</div>';
            }

            function createSubmissionsList(submissions) {
              if (!submissions || submissions.length === 0) {
                return '<div class="page-content">' +
                  '<h2>Submissions</h2>' +
                  '<div class="empty-state">' +
                    '<p>No submissions yet. Create a new submission to get started.</p>' +
                  '</div>' +
                '</div>';
              }

              const submissionCards = submissions.map(submission => {
                if (submission.title) {
                  // Issue submission
                  return '<div class="submission-card">' +
                    '<div class="card-header">' +
                      '<h3>' + submission.title + '</h3>' +
                      '<span class="badge ' + submission.priority + '">' + submission.priority + '</span>' +
                    '</div>' +
                    '<div class="card-content">' +
                      '<p><strong>Category:</strong> ' + submission.category + '</p>' +
                      '<p><strong>Description:</strong> ' + submission.description + '</p>' +
                    '</div>' +
                    '<div class="card-footer">' +
                      '<span class="submission-time">Submitted: ' + submission.timestamp + '</span>' +
                    '</div>' +
                  '</div>';
                } else {
                  // Contact form submission
                  return '<div class="submission-card">' +
                    '<div class="card-header">' +
                      '<h3>Contact Request</h3>' +
                      '<span class="badge contact">Contact</span>' +
                    '</div>' +
                    '<div class="card-content">' +
                      '<p><strong>Name:</strong> ' + submission.name + '</p>' +
                      '<p><strong>Email:</strong> ' + submission.email + '</p>' +
                      '<p><strong>Phone:</strong> ' + submission.phone + '</p>' +
                      '<p><strong>Message:</strong> ' + submission.message + '</p>' +
                    '</div>' +
                    '<div class="card-footer">' +
                      '<span class="submission-time">Submitted: ' + submission.timestamp + '</span>' +
                    '</div>' +
                  '</div>';
                }
              }).join('');

              return '<div class="page-content">' +
                '<h2>Submissions</h2>' +
                '<div class="submissions-list">' +
                  submissionCards +
                '</div>' +
              '</div>';
            }

            // Initialize vscode API and state first
            const vscode = (() => {
              // Check if running in VSCode webview context
              if (typeof acquireVsCodeApi === 'function') {
                return acquireVsCodeApi();
              }
              // Fallback for when not in VSCode context (development/testing)
              return {
                postMessage: (msg) => {
                  console.log('Development mode - message:', msg);
                },
                getState: () => {
                  const stored = sessionStorage.getItem('devState');
                  return stored ? JSON.parse(stored) : null;
                },
                setState: (state) => {
                  sessionStorage.setItem('devState', JSON.stringify(state));
                }
              };
            })();

            // Initialize state
            const currentState = vscode.getState() || ${JSON.stringify(state)};
            vscode.setState(currentState);

            // Define navigation handler with error handling
            function handleNavigation(page) {
              try {
                console.log('Navigation clicked:', page);
                const timestamp = new Date().toLocaleString();
                console.log('Navigation time:', timestamp);
                
                // Update active state in navigation
                const navItems = document.querySelectorAll('.nav-item');
                navItems.forEach(item => {
                  item.classList.remove('active');
                  if (item.getAttribute('data-page') === page) {
                    item.classList.add('active');
                  }
                });

                // Log which form is being accessed
                switch(page) {
                  case 'contact':
                    console.log('Accessing Contact Form');
                    break;
                  case 'submission':
                    console.log('Accessing New Issue Form');
                    break;
                  case 'submissions':
                    console.log('Accessing Submissions List');
                    const submissions = currentState?.submissions || [];
                    console.log('Total submissions:', submissions.length);
                    break;
                }

                // Update the UI immediately
                const mainContent = document.querySelector('.main-content');
                if (mainContent) {
                  switch(page) {
                    case 'contact':
                      mainContent.innerHTML = createContactForm();
                      break;
                    case 'submission':
                      mainContent.innerHTML = createSubmissionForm();
                      break;
                    case 'submissions':
                      mainContent.innerHTML = createSubmissionsList(currentState?.submissions || []);
                      break;
                  }
                }

                // Update state
                currentState.currentPage = page;
                vscode.setState(currentState);

                // Post message to extension
                vscode.postMessage({
                  type: 'navigation',
                  page: page,
                  timestamp: timestamp,
                  logData: {
                    action: 'navigation',
                    destination: page,
                    time: timestamp
                  }
                });
              } catch (error) {
                console.error('Navigation error:', error);
                const mainContent = document.querySelector('.main-content');
                if (mainContent) {
                  mainContent.innerHTML = 
                    '<div class="page-content">' +
                    '<div style="color: #e74c3c; padding: 20px; text-align: center;">' +
                    '<h3>Navigation Error</h3>' +
                    '<p>' + error.message + '</p>' +
                    '</div>' +
                    '</div>';
                }
              }
            }

            // Form handling
            document.addEventListener('DOMContentLoaded', () => {
              try {
                const contactForm = document.getElementById('contactForm');
                if (contactForm) {
                  contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    try {
                      const formData = {
                        name: document.getElementById('name').value,
                        email: document.getElementById('email').value,
                        phone: document.getElementById('phone').value,
                        message: document.getElementById('message').value,
                        timestamp: new Date().toLocaleString()
                      };
                      console.log('Submitting contact form:', formData);
                      vscode.postMessage({
                        type: 'submit',
                        data: formData,
                        nextPage: 'submission'
                      });
                      e.target.reset();
                    } catch (error) {
                      console.error('Contact form submission error:', error);
                    }
                  });
                }

                const submissionForm = document.getElementById('submissionForm');
                if (submissionForm) {
                  submissionForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    try {
                      const formData = {
                        title: document.getElementById('title').value,
                        category: document.getElementById('category').value,
                        priority: document.getElementById('priority').value,
                        description: document.getElementById('description').value,
                        timestamp: new Date().toLocaleString()
                      };
                      console.log('Submitting issue:', formData);
                      vscode.postMessage({
                        type: 'submit',
                        data: formData,
                        nextPage: 'submissions'
                      });
                      e.target.reset();
                    } catch (error) {
                      console.error('Submission form error:', error);
                    }
                  });
                }
              } catch (error) {
                console.error('Form initialization error:', error);
              }
            });

            // Initial page load
            handleNavigation(currentState.currentPage || 'contact');
          </script>
        </body>
      </html>
    `;
  }

  // Handle messages from the webview
  panel.webview.onDidReceiveMessage(
    message => {
      console.log('Received message:', message);
      switch (message.type) {
        case 'navigation':
          console.log('Navigation event received:', {
            page: message.page,
            timestamp: message.timestamp
          });
          if (message.logData) {
            console.log('Navigation log:', message.logData);
          }
          state.currentPage = message.page;
          updateContent();
          break;
        case 'submit':
          console.log('Form submitted:', message.data);
          state.submissions.push(message.data);
          state.currentPage = message.nextPage || 'submissions';
          updateContent();
          break;
      }
    },
    undefined,
    context.subscriptions
  );

  // Initial render
  updateContent();

  // Clean up when the panel is disposed
  panel.onDidDispose(
    () => {
      // Clean up resources
    },
    null,
    context.subscriptions
  );
}

module.exports = {
  activate
}; 