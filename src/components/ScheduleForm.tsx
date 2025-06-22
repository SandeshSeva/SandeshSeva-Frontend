
import React, { useState, useEffect } from 'react';
import { MessageType, ScheduledMessage } from '../types/Message';
import { Mail, MessageCircle, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ScheduleFormProps {
  onSave: (message: Omit<ScheduledMessage, 'id' | 'createdAt'>) => void;
  editingMessage?: ScheduledMessage | null;
  onCancel: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onSave, editingMessage, onCancel }) => {
  const { user } = useAuth();
  const [messageType, setMessageType] = useState<MessageType>('email');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  useEffect(() => {
    if (editingMessage) {
      setMessageType(editingMessage.type);
      setRecipient(editingMessage.recipient);
      setSubject(editingMessage.subject || '');
      setBody(editingMessage.body);
      
      const date = new Date(editingMessage.scheduledFor);
      setScheduledDate(date.toISOString().split('T')[0]);
      setScheduledTime(date.toTimeString().slice(0, 5));
    } else {
      // Reset form for new message
      setMessageType('email');
      setRecipient('');
      setSubject('');
      setBody('');
      setScheduledDate('');
      setScheduledTime('');
    }
  }, [editingMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient || !body || !scheduledDate || !scheduledTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (messageType === 'email' && !subject) {
      toast({
        title: "Error",
        description: "Subject is required for email messages",
        variant: "destructive",
      });
      return;
    }

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);
    if (scheduledFor <= new Date()) {
      toast({
        title: "Error",
        description: "Please schedule the message for a future date and time",
        variant: "destructive",
      });
      return;
    }

    const messageData = {
      userId: user!.id,
      type: messageType,
      recipient,
      subject: messageType === 'email' ? subject : undefined,
      body,
      scheduledFor,
      status: 'pending' as const,
      sentAt: undefined,
    };

    onSave(messageData);
    
    // Reset form
    setMessageType('email');
    setRecipient('');
    setSubject('');
    setBody('');
    setScheduledDate('');
    setScheduledTime('');
    
    toast({
      title: "Success",
      description: editingMessage ? "Message updated successfully!" : "Message scheduled successfully!",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {editingMessage ? 'Edit Message' : 'Schedule New Message'}
        </h2>
        {editingMessage && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Message Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMessageType('email')}
              className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-lg transition-all ${
                messageType === 'email'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Mail className="h-5 w-5" />
              <span className="font-medium">Email</span>
            </button>
            <button
              type="button"
              onClick={() => setMessageType('whatsapp')}
              className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-lg transition-all ${
                messageType === 'whatsapp'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">WhatsApp</span>
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
            {messageType === 'email' ? 'Email Address' : 'Phone Number'}
          </label>
          <input
            type={messageType === 'email' ? 'email' : 'tel'}
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder={messageType === 'email' ? 'recipient@example.com' : '+1234567890'}
            required
          />
        </div>

        {messageType === 'email' && (
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter email subject"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
            Message Body
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            placeholder="Enter your message here..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                id="scheduledDate"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="time"
                id="scheduledTime"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          {editingMessage && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {editingMessage ? 'Update Message' : 'Schedule Message'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
