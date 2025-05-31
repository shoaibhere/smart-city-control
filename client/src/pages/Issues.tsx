import React, { useEffect, useState } from 'react';
import {
  getIssues,
  updateIssue,
  deleteIssue
} from '../lib/issueApi';
import {
  Modal,
  Button,
  Form,
  Table,
  Spinner
} from 'react-bootstrap';

const IssuesRUDPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    status: 'open',
    department: '',
  });

  const fetchIssues = async () => {
    try {
      const { data } = await getIssues();
      setIssues(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch issues:', err);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleEditClick = issue => {
    setSelectedIssue(issue);
    setFormData({
      title: issue.title,
      description: issue.description,
      location: issue.location,
      status: issue.status,
      department: issue.department || '',
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = issue => {
    setSelectedIssue(issue);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      await updateIssue(selectedIssue._id, formData);
      setShowEditModal(false);
      fetchIssues();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await deleteIssue(selectedIssue._id);
      setShowDeleteModal(false);
      fetchIssues();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="container mt-4">
      <h3>Manage Issues</h3>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Location</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue._id}>
                <td>{issue.title}</td>
                <td>{issue.status}</td>
                <td>{issue.location}</td>
                <td>{issue.department || 'N/A'}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEditClick(issue)}
                  >
                    Edit
                  </Button>{' '}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(issue)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* 🟡 Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Department</Form.Label>
              <Form.Control
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 🔴 Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the issue "
          <strong>{selectedIssue?.title}</strong>"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default IssuesRUDPage;
