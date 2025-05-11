'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FeedbackPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    axios.get('http://localhost:3000/api/message')
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/message/${id}`);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/message/${id}`);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="container mt-5">
      <h1 className="text-center mb-4">Customer Feedback</h1>
      {messages.length === 0 ? (
        <p className="text-center">No feedback yet.</p>
      ) : (
        <div className="row g-4">
          {messages.map(msg => (
            <div className="col-md-6 col-lg-4" key={msg._id}>
              <div className={`card h-100 shadow-sm border-${msg.read === 'Yes' ? 'success' : 'danger'}`}>
                <div className="card-body">
                  <h5 className="card-title">{msg.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{msg.email}</h6>
                  <p className="mb-1"><strong>Phone:</strong> {msg.phone}</p>
                  <p className="mb-1"><strong>Subject:</strong> {msg.subject}</p>
                  <p className="card-text mt-2">{msg.message}</p>
                  <span className={`badge ${msg.read === 'Yes' ? 'bg-success' : 'bg-danger'}`}>
                    {msg.read === 'Yes' ? 'Read' : 'Unread'}
                  </span>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button className="btn btn-sm btn-outline-success" onClick={() => markAsRead(msg._id)} disabled={msg.read === 'Yes'}>
                    Mark as Read
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteMessage(msg._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
