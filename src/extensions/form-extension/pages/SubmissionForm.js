function createSubmissionForm() {
  return `
    <div class="page-content">
      <h2>New Submission</h2>
      <form id="submissionForm" class="submission-form">
        <div class="form-group">
          <label for="title">Title:</label>
          <input type="text" id="title" name="title" required>
        </div>
        <div class="form-group">
          <label for="category">Category:</label>
          <select id="category" name="category" required>
            <option value="">Select a category</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="task">Task</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label for="priority">Priority:</label>
          <select id="priority" name="priority" required>
            <option value="">Select priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" name="description" rows="4" required></textarea>
        </div>
        <button type="submit">Submit New Issue</button>
      </form>
    </div>
  `;
}

module.exports = createSubmissionForm; 