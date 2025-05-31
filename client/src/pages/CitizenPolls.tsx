import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Countdown from 'react-countdown';
import { motion } from 'framer-motion';

const CitizenPolls = () => {
  const [activePolls, setActivePolls] = useState([]);
  const [completedPolls, setCompletedPolls] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await fetch('http://localhost:8000/api/me/', {
            method: 'GET',
            credentials: 'include', // ✅ sends cookies
          });
  
          if (!res.ok) throw new Error('Unauthorized');
          const data = await res.json();
  
          setUser(data.user);
        } catch (err) {
          console.log(err)
        } finally {
          setLoading(false);
        }
      };
  
      fetchUser();
    }, []);
    
  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      // Fetch all polls and separate them
      const res = await axios.get('http://localhost:8000/api/polls', { withCredentials: true });
      const now = new Date();
      
      const active = res.data.filter(poll => new Date(poll.deadline) > now);
      const completed = res.data.filter(poll => new Date(poll.deadline) <= now);
      
      setActivePolls(active);
      setCompletedPolls(completed);
      
      // Get user's votes
      const votes = {};
      res.data.forEach(poll => {
        poll.options.forEach(opt => {
          if (opt.voters.includes(user._id)) { // Assuming you have user context
            votes[poll._id] = opt.text;
          }
        });
      });
      setUserVotes(votes);
    } catch (err) {
      console.error('Failed to fetch polls', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionText) => {
    try {
      setLoading(true);
      const poll = activePolls.find(p => p._id === pollId);
      const option = poll.options.find(opt => opt.text === optionText);
      
      if (!option) throw new Error('Option not found');

      await axios.post(
        `http://localhost:8000/api/polls/${pollId}/vote`, 
        { optionId: option._id },
        { withCredentials: true }
      );
      
      // Update local state
      setUserVotes(prev => ({ ...prev, [pollId]: optionText }));
      await fetchPolls(); // Refresh data
    } catch (err) {
      console.error('Voting failed:', err);
      alert(err.response?.data?.message || 'Voting failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Countdown renderer with animation
  const renderCountdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span className="text-red-500 font-medium">Poll ended</span>;
    }

    return (
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="flex gap-1 items-center"
      >
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {days}d
        </span>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {hours}h
        </span>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {minutes}m
        </span>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {seconds}s
        </span>
      </motion.div>
    );
  };

  // Calculate percentage for vote visualization
  const calculatePercentage = (votes, totalVotes) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  const renderPollCard = (poll, isActive) => {
    const userVote = userVotes[poll._id];
    const totalVotes = poll.totalVotes || 0;
    
    return (
      <motion.div 
        key={poll._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`border p-4 mb-6 rounded-lg shadow hover:shadow-md transition-shadow ${
          isActive ? 'bg-white' : 'bg-gray-50'
        }`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {poll.image && (
            <div className="md:w-1/3">
              <img
                src={poll.image}
                alt={`Visual for poll: ${poll.question}`}
                className="w-full h-48 md:h-full object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className={`${poll.image ? 'md:w-2/3' : 'w-full'}`}>
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold">{poll.question}</h2>
              {isActive ? (
                <div className="text-sm text-gray-500">
                  <Countdown 
                    date={new Date(poll.deadline)} 
                    renderer={renderCountdown}
                  />
                </div>
              ) : (
                <span className="text-sm text-red-500 font-medium">Completed</span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Total votes: {totalVotes}
            </p>
            
            <div className="space-y-3">
              {poll.options.map(opt => {
                const percentage = calculatePercentage(opt.votes, totalVotes);
                const isVoted = userVote === opt.text;
                
                return (
                  <div key={opt._id} className="relative">
                    {isActive ? (
                      <button
                        disabled={loading}
                        onClick={() => handleVote(poll._id, opt.text)}
                        className={`w-full px-4 py-3 border rounded-lg transition-all relative overflow-hidden ${
                          isVoted
                            ? 'bg-green-100 border-green-500'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-center z-10 relative">
                          <span className="font-medium">{opt.text}</span>
                          <span className="text-sm">
                            {opt.votes} ({percentage}%)
                          </span>
                        </div>
                        
                        {/* Vote progress bar */}
                        <div 
                          className={`absolute top-0 left-0 h-full ${
                            isVoted ? 'bg-green-200' : 'bg-blue-200'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </button>
                    ) : (
                      <div className="w-full px-4 py-3 border rounded-lg bg-gray-50 relative">
                        <div className="flex justify-between items-center z-10 relative">
                          <span className="font-medium">{opt.text}</span>
                          <span className="text-sm">
                            {opt.votes} ({percentage}%)
                          </span>
                        </div>
                        
                        {/* Results bar */}
                        <div 
                          className={`absolute top-0 left-0 h-full ${
                            isVoted ? 'bg-green-200' : 'bg-gray-200'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {userVote && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-3 flex items-center gap-2 ${
                  isActive ? 'text-green-600' : 'text-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Your vote: {userVote}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Active Polls</h1>
      
      {loading && (
        <div className="text-center py-4">
          <p>Loading polls...</p>
        </div>
      )}
      
      {activePolls.length === 0 && !loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No active polls at the moment.</p>
        </div>
      ) : (
        activePolls.map(poll => renderPollCard(poll, true))
      )}
      
      {completedPolls.length > 0 && (
        <>
          <h1 className="text-2xl font-bold mb-6 mt-12">Completed Polls</h1>
          {completedPolls.map(poll => renderPollCard(poll, false))}
        </>
      )}
    </div>
  );
};

export default CitizenPolls;