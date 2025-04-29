function createSubmissionsList(submissions = []) {
  return `
    <div class="page-content">
      <h2>Submissions List</h2>
      ${submissions.length === 0 ? `
        <div class="empty-state">
          <p>No submissions yet. Create a new submission to see it here.</p>
        </div>
      ` : `
        <div class="submissions-list">
          ${submissions.map(submission => `
            <div class="submission-card ${submission.title ? 'issue-card' : 'contact-card'}">
              ${submission.title ? `
                <div class="card-header">
                  <h3>${submission.title}</h3>
                  <span class="badge ${submission.priority}">${submission.priority}</span>
                </div>
                <div class="card-content">
                  <p><strong>Category:</strong> ${submission.category}</p>
                  <p><strong>Description:</strong> ${submission.description}</p>
                </div>
              ` : `
                <div class="card-header">
                  <h3>${submission.name}</h3>
                  <span class="badge contact">Contact</span>
                </div>
                <div class="card-content">
                  <p><strong>Email:</strong> ${submission.email}</p>
                  <p><strong>Phone:</strong> ${submission.phone}</p>
                  <p><strong>Message:</strong> ${submission.message}</p>
                </div>
              `}
              <div class="card-footer">
                <span class="submission-time">Submitted: ${submission.timestamp}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

module.exports = createSubmissionsList; 