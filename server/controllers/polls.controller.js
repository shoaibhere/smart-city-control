import Poll from '../models/poll.js';
import User from '../models/users.model.js';
import Notification from '../models/notification.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find({
      deadline: { $gte: Date.now() }
    }).sort('-createdAt');
    
    res.json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createPoll = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { question, options, deadline } = req.body;
    
    let image;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, 'poll_images');
      image = result.url;
    }

    const poll = new Poll({
      question,
      options: JSON.parse(options).map(opt => ({ text: opt })),
      deadline,
      image,
      createdBy: req.user.id
    });

    await poll.save();

    const citizens = await User.find({ role: 'citizen' });
    for (const citizen of citizens) {
      await Notification.create({
        recipient: citizen._id,
        sender: req.user.id,
        type: 'poll',
        relatedEntity: poll._id,
        message: `New poll available: ${question}`
      });
    }

    res.status(201).json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const voteOnPoll = async (req, res) => {
  try {
    if (req.user.role !== 'citizen') {
      return res.status(403).json({ message: 'Only citizens can vote' });
    }

    const { optionId } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    if (poll.deadline < Date.now()) {
      return res.status(400).json({ message: 'Poll deadline has passed' });
    }

    const hasVoted = poll.options.some(opt => 
      opt.voters.some(voter => voter.equals(req.user.id))
    );
    if (hasVoted) {
      return res.status(400).json({ message: 'You have already voted' });
    }

    const option = poll.options.id(optionId);
    if (!option) {
      return res.status(400).json({ message: 'Invalid option' });
    }

    option.votes += 1;
    option.voters.push(req.user.id);
    poll.totalVotes += 1;
    await poll.save();

    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};