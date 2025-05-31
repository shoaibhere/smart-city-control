import User from '../models/users.model.js';
import Chat from '../models/chat.model.js';

// @desc    Get all chats for user
// @route   GET /api/chats
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id
    })
    .populate('participants', 'username profile')
    .populate('groupAdmin', 'username profile')
    .populate('lastMessage.sender', 'username profile')
    .sort('-updatedAt');

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new chat (individual)
// @route   POST /api/chats
export const createChat = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [req.user.id, userId] }
    });

    if (chat) {
      return res.json(chat);
    }

    // Create new chat
    chat = new Chat({
      participants: [req.user.id, userId],
      isGroupChat: false
    });

    await chat.save();
    
    // Populate participants
    await chat.populate('participants', 'username profile').execPopulate();

    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new group chat
// @route   POST /api/chats/group
export const createGroupChat = async (req, res) => {
  try {
    const { name, users } = req.body;

    if (!name || !users || users.length < 2) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Add current user to participants
    users.push(req.user.id);

    const chat = new Chat({
      groupName: name,
      participants: users,
      isGroupChat: true,
      groupAdmin: req.user.id
    });

    await chat.save();
    
    // Populate participants and admin
    await chat.populate('participants', 'username profile')
              .populate('groupAdmin', 'username profile')
              .execPopulate();

    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Send message in chat
// @route   POST /api/chats/:id/messages
export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p.equals(req.user.id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = {
      sender: req.user.id,
      content
    };

    chat.messages.push(message);
    chat.lastMessage = message;
    await chat.save();

    // Populate sender in the message
    const populatedMessage = {
      ...message.toObject(),
      sender: {
        _id: req.user._id,
        username: req.user.username,
        profile: req.user.profile
      }
    };

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};