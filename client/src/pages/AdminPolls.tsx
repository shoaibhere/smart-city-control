import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Important for accessibility

const AdminPollManager = () => {
  const [polls, setPolls] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);

  const [formData, setFormData] = useState({
    question: '',
    options: '',
    deadline: '',
    image: null,
  });

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/polls',{withCredentials:true});
      setPolls(res.data);
    } catch (err) {
      console.error('Failed to fetch polls', err);
    }
  };

  const openModal = (poll = null) => {
    setEditMode(!!poll);
    setSelectedPoll(poll);
    setFormData(
      poll
        ? {
            question: poll.question,
            options: poll.options.map(opt => opt.text).join(','),
            deadline: new Date(poll.deadline).toISOString().slice(0, 16),
            image: null,
          }
        : { question: '', options: '', deadline: '', image: null }
    );
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPoll(null);
    setFormData({ question: '', options: '', deadline: '', image: null });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const form = new FormData();
    form.append('question', formData.question);
    form.append('options', JSON.stringify(formData.options.split(',').map(opt => opt.trim())));
    form.append('deadline', formData.deadline);
    if (formData.image) {
      form.append('image', formData.image);
    }

    console.log('Submitting:', { 
      question: formData.question,
      options: formData.options,
      deadline: formData.deadline,
      hasImage: !!formData.image 
    });

    const response = editMode
      ? await axios.put(`http://localhost:8000/api/polls/${selectedPoll._id}`, form,{withCredentials:true})
      : await axios.post('http://localhost:8000/api/polls', form,{withCredentials:true});

    console.log('Response:', response.data);
    fetchPolls();
    closeModal();
  } catch (err) {
    console.error('Poll submission failed:', err.response?.data || err.message);
  }
};

  const handleDelete = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/polls/${pollId}`,{withCredentials:true});
      fetchPolls();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Polls</h1>
        <button onClick={() => openModal()} className="bg-green-600 text-white px-4 py-2 rounded">
          + New Poll
        </button>
      </div>

      {polls.map((poll) => (
        <div key={poll._id} className="border p-4 mb-4 rounded shadow">
          <h2 className="text-lg font-semibold">{poll.question}</h2>
          <p className="text-sm text-gray-500 mb-2">
            Deadline: {new Date(poll.deadline).toLocaleString()}
          </p>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => openModal(poll)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(poll._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Poll Modal" className="bg-white max-w-lg mx-auto mt-20 p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? 'Edit Poll' : 'Create New Poll'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleInputChange}
            placeholder="Poll question"
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="options"
            value={formData.options}
            onChange={handleInputChange}
            placeholder="Comma-separated options"
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="datetime-local"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full"
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {editMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPollManager;
