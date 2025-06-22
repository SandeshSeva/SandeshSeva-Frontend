
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ScheduledMessage } from '../types/Message';
import Navbar from '../components/Navbar';
import MessageCard from '../components/MessageCard';
import ScheduleForm from '../components/ScheduleForm';
import { Plus, MessageSquare, Clock, CheckCircle, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMessage, setEditingMessage] = useState<ScheduledMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockMessages: ScheduledMessage[] = [
      {
        id: '1',
        userId: user!.id,
        type: 'email',
        recipient: 'john@example.com',
        subject: 'Welcome to our service',
        body: 'Thank you for joining us! We are excited to have you on board.',
        scheduledFor: new Date(Date.now() + 86400000), // Tomorrow
        status: 'pending',
        createdAt: new Date(),
      },
      {
        id: '2',
        userId: user!.id,
        type: 'whatsapp',
        recipient: '+1234567890',
        body: 'Your appointment is confirmed for tomorrow at 2 PM.',
        scheduledFor: new Date(Date.now() + 43200000), // 12 hours from now
        status: 'sent',
        createdAt: new Date(Date.now() - 86400000),
        sentAt: new Date(Date.now() - 3600000),
      },
    ];
    setMessages(mockMessages);
  }, [user]);

  const handleSaveMessage = (messageData: Omit<ScheduledMessage, 'id' | 'createdAt'>) => {
    if (editingMessage) {
      // Update existing message
      setMessages(prev => prev.map(msg => 
        msg.id === editingMessage.id 
          ? { ...messageData, id: editingMessage.id, createdAt: editingMessage.createdAt }
          : msg
      ));
      setEditingMessage(null);
    } else {
      // Create new message
      const newMessage: ScheduledMessage = {
        ...messageData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setMessages(prev => [newMessage, ...prev]);
    }
    setShowForm(false);
  };

  const handleEditMessage = (message: ScheduledMessage) => {
    setEditingMessage(message);
    setShowForm(true);
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(prev => prev.filter(msg => msg.id !== id));
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setShowForm(false);
  };

  const filteredMessages = messages.filter(message => {
    const statusMatch = filterStatus === 'all' || message.status === filterStatus;
    const typeMatch = filterType === 'all' || message.type === filterType;
    return statusMatch && typeMatch;
  });

  const stats = {
    total: messages.length,
    pending: messages.filter(m => m.status === 'pending').length,
    sent: messages.filter(m => m.status === 'sent').length,
    failed: messages.filter(m => m.status === 'failed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Message Dashboard</h1>
            <p className="mt-2 text-gray-600">Schedule and manage your messages</p>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span>New Message</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.sent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Form */}
        {showForm && (
          <div className="mb-8">
            <ScheduleForm
              onSave={handleSaveMessage}
              editingMessage={editingMessage}
              onCancel={handleCancelEdit}
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-6">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
              <p className="text-gray-600 mb-4">
                {messages.length === 0
                  ? "Get started by scheduling your first message"
                  : "No messages match your current filters"}
              </p>
              {messages.length === 0 && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Schedule Message</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
