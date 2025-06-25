import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiSend, FiMessageCircle, FiX, FiUser, FiPaperclip, FiHelpCircle } from 'react-icons/fi';
import { RiAdminFill } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import './ChatSystem.css';

const socket = io('https://mediconnetbackend.onrender.com');

const ChatSystem = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [chats, setChats] = useState([]);
	const [selectedChatId, setSelectedChatId] = useState(null);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [showFAQ, setShowFAQ] = useState(false);
	const [faqs, setFaqs] = useState([]);
	const messagesEndRef = useRef(null);
	const fileInputRef = useRef(null);

	const { currentpatient, isLogin } = useSelector(state => state.patientAuthorLoginSlice);
	const userId = currentpatient?._id;
	const userName = isLogin ? currentpatient.FirstName : '';
	
	const selectedChat = chats.find(c => c._id === selectedChatId);

	// Effect to fetch initial chats and FAQs
	useEffect(() => {
		if (isOpen && userId) {
			fetchChats();
			fetchFAQs();
		}
	}, [isOpen, userId]);
	
	// Effect to handle socket events
	useEffect(() => {
		if (!userId) return;

		const handleNewMessage = (newMessageData) => {
			if (newMessageData.chatId === selectedChatId) {
				setMessages(prev => [...prev, newMessageData.dbMessage]);
			}
			setChats(prevChats =>
				prevChats.map(chat =>
					chat._id === newMessageData.chatId
						? { ...chat, lastMessage: newMessageData.dbMessage.message, lastMessageTimestamp: newMessageData.dbMessage.timestamp }
						: chat
				).sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp))
			);
		};

		socket.on('newMessage', handleNewMessage);
		return () => {
			socket.off('newMessage', handleNewMessage);
		};
	}, [userId, selectedChatId]);
	
	// Effect to handle selecting a chat
	useEffect(() => {
		if (selectedChatId) {
			socket.emit('joinChat', selectedChatId);
			fetchMessages(selectedChatId);
		}
		return () => {
			if (selectedChatId) {
				socket.emit('leaveChat', selectedChatId);
			}
		};
	}, [selectedChatId]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const fetchChats = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`https://mediconnetbackend.onrender.com/chat-api/chats/user/${userId}?userType=patient`);
			const fetchedChats = (response.data.chats || []).sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp));
			setChats(fetchedChats);
			// Automatically select the first chat if none is selected
			if (fetchedChats.length > 0 && !selectedChatId) {
				setSelectedChatId(fetchedChats[0]._id);
			}
		} catch (err) {
			setError("Failed to load chats.");
		} finally {
			setLoading(false);
		}
	};
	
	const fetchMessages = async (chatId) => {
		setLoading(true);
		try {
			const response = await axios.get(`https://mediconnetbackend.onrender.com/chat-api/chats/${chatId}/messages`);
			setMessages(response.data.messages || []);
			await axios.put(`https://mediconnetbackend.onrender.com/chat-api/chats/${chatId}/read`, { userId });
		} catch (err) {
			setError("Failed to load messages.");
		} finally {
			setLoading(false);
		}
	};

	const fetchFAQs = async () => {
		try {
			const response = await axios.get(`https://mediconnetbackend.onrender.com/chat-api/faq?audience=patient`);
			if (response.data.faqs) {
				setFaqs(response.data.faqs);
			}
		} catch (err) {
			console.error("Error fetching FAQs:", err);
			// Optionally set an error state for FAQs
		}
	};

	const handleSendMessage = async () => {
		if (!newMessage.trim() || !selectedChatId) return;

		const messageData = {
			senderId: userId,
			senderType: 'patient',
			message: newMessage.trim(),
			messageType: 'text',
			chatId: selectedChatId
		};
		
		setNewMessage(''); 
		try {
			await axios.post(`https://mediconnetbackend.onrender.com/chat-api/chats/${selectedChatId}/message`, messageData);
		} catch (error) {
			setError("Failed to send message");
			setNewMessage(messageData.message);
		}
	};

	const handleFileUpload = async (e) => {
		if (!selectedChatId) return;
		const file = e.target.files[0];
		if (!file) return;
		if (file.size > 5 * 1024 * 1024) {
			setError("File size must be under 5MB.");
			return;
		}

		const formData = new FormData();
		formData.append('file', file);
		formData.append('senderId', userId);
		formData.append('senderType', 'patient');
		formData.append('chatId', selectedChatId);
		
		try {
			await axios.post(`https://mediconnetbackend.onrender.com/chat-api/upload-and-send`, formData);
		} catch (err) {
			setError("File upload failed.");
		} finally {
			if (fileInputRef.current) fileInputRef.current.value = '';
		}
	};
	
	const handleKeyPress = (e) => (e.key === 'Enter' && !e.shiftKey) && (e.preventDefault(), handleSendMessage());

	const getParticipantInfo = (chat) => {
		if (!chat || !chat.otherParticipants) return { name: 'Support', profilePicture: null, userType: 'admin' };
		const other = chat.otherParticipants[0];
		return {
			name: other.userType === 'admin' ? 'Admin' : `Dr. ${other.name}`,
			profilePicture: other.profilePicture,
			userType: other.userType
		};
	};

	const getPreviewText = (lastMessage) => {
		if (!lastMessage) {
			return 'Start a conversation';
		}
		// Defensively handle both string and object types
		const messageText = typeof lastMessage === 'object' && lastMessage !== null && lastMessage.message
			? lastMessage.message
			: lastMessage;

		if (typeof messageText !== 'string') {
			return '...'; // Fallback for unexpected types
		}

		return messageText.length > 25 ? `${messageText.substring(0, 25)}...` : messageText;
	};

	const formatTime = (timestamp) => {
		const date = new Date(timestamp);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const renderMessage = (message) => {
		const isOutgoing = message.senderId === userId;
		
		let content;
		if (message.messageType === 'image') {
			content = <img src={message.message} alt="Shared image" className="message-image" />;
		} else if (message.messageType === 'document') {
			content = (
				<a href={message.message} target="_blank" rel="noopener noreferrer" className="document-link">
					{message.fileName || 'Document'}
				</a>
			);
		} else {
			content = message.message;
		}
		
		return (
			<div key={message._id} className={`chat-message ${isOutgoing ? 'outgoing' : 'incoming'}`}>
				<div className="message-content">
					{content}
				</div>
				<div className="message-time">{formatTime(message.timestamp)}</div>
			</div>
		);
	};

	const chatToggleButton = (
		<button 
			className="chat-toggle-button"
			onClick={() => setIsOpen(!isOpen)}
			aria-label={isOpen ? "Close chat" : "Open chat"}
		>
			{isOpen ? <FiX /> : <FiMessageCircle />}
		</button>
	);

	if (!isLogin) return null; // Don't render if not logged in

	return (
		<>
			{chatToggleButton}
			
			{isOpen && (
				<div className={`chat-window-container ${showFAQ ? 'faq-open' : ''}`}>
					<div className="chat-sidebar">
						<h5>Conversations</h5>
						<div className="chat-list">
							{loading && chats.length === 0 ? <p>Loading...</p> :
							 chats.length > 0 ? (
								chats
									.sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp))
									.map(chat => (
										<div key={chat._id} className={`chat-list-item ${selectedChatId === chat._id ? 'active' : ''}`} onClick={() => setSelectedChatId(chat._id)}>
											<div className="chat-avatar">
												{getParticipantInfo(chat).profilePicture ? (
													<img src={getParticipantInfo(chat).profilePicture} alt="Avatar" />
												) : (
													<div className="avatar-placeholder">
														{chat.otherParticipants[0]?.userType === 'admin' ? <RiAdminFill /> : <FiUser />}
													</div>
												)}
											</div>
											<div className="chat-info">
												<div className="chat-name">{getParticipantInfo(chat).name}</div>
												<div className="chat-preview">
													{getPreviewText(chat.lastMessage)}
												</div>
											</div>
											{chat.lastMessage && !chat.lastMessage.isRead && chat.lastMessage.senderId !== userId && (
												<div className="unread-badge"></div>
											)}
										</div>
									))
								) : (
									<div className="empty-chat-list">
										<FiMessageCircle />
										<p>No conversations yet</p>
									</div>
								)}
						</div>
					</div>
					<div className="chat-main">
						{selectedChat ? (
							<>
								<div className="chat-header">
									<div className="chat-header-info">
										<h3>{getParticipantInfo(selectedChat).name}</h3>
										{selectedChat.otherParticipants[0]?.userType === 'doctor' && selectedChat.appointmentDetails && (
											<div className="appointment-info">
												Appointment: {selectedChat.appointmentDetails.date}
											</div>
										)}
									</div>
									<button className="faq-toggle-button" onClick={() => setShowFAQ(!showFAQ)}>
										<FiHelpCircle />
									</button>
								</div>
								
								<div className="chat-messages">
									{messages.map(message => renderMessage(message))}
									<div ref={messagesEndRef} />
								</div>
								
								<div className="chat-input-area">
									<button 
										className="attachment-button"
										onClick={() => fileInputRef.current?.click()}
									>
										<FiPaperclip />
									</button>
									<input 
										type="file"
										ref={fileInputRef}
										style={{ display: 'none' }}
										onChange={handleFileUpload}
									/>
									<textarea
										placeholder="Type a message..."
										value={newMessage}
										onChange={e => setNewMessage(e.target.value)}
										onKeyPress={handleKeyPress}
									/>
									<button 
										className="send-button"
										onClick={handleSendMessage}
										disabled={!newMessage.trim()}
									>
										<FiSend />
									</button>
								</div>
							</>
						) : (
							<div className="placeholder-content">
								<FiMessageCircle size={40} />
								<p>Select a conversation</p>
							</div>
						)}
					</div>
					{showFAQ && (
						<div className="faq-panel-container">
							<div className="faq-panel-header">
								<h3>FAQs</h3>
								<button onClick={() => setShowFAQ(false)}><FiX /></button>
							</div>
							<div className="faq-panel-list">
								{faqs.length > 0 ? faqs.map(faq => (
									<div key={faq._id} className="faq-panel-item">
										<strong>{faq.question}</strong>
										<p>{faq.answer}</p>
										<button onClick={() => {
											setNewMessage(faq.answer);
											setShowFAQ(false);
										}}>Use this answer</button>
									</div>
								)) : <p>No FAQs found.</p>}
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default ChatSystem; 