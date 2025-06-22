
import React from 'react';
import { ScheduledMessage } from '../types/Message';
import { Mail, MessageCircle, Clock, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface MessageCardProps {
  message: ScheduledMessage;
  onEdit: (message: ScheduledMessage) => void;
  onDelete: (id: string) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, onEdit, onDelete }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50">
            {message.type === 'email' ? (
              <Mail className="h-5 w-5 text-blue-600" />
            ) : (
              <MessageCircle className="h-5 w-5 text-green-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {message.type} Message
            </h3>
            <p className="text-sm text-gray-600">To: {message.recipient}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
            {getStatusIcon(message.status)}
            <span className="capitalize">{message.status}</span>
          </span>
        </div>
      </div>

      {message.subject && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700">Subject:</p>
          <p className="text-sm text-gray-900">{message.subject}</p>
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
        <p className="text-sm text-gray-900 line-clamp-3">{message.body}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          <p className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Scheduled: {format(new Date(message.scheduledFor), 'MMM dd, yyyy HH:mm')}</span>
          </p>
          {message.sentAt && (
            <p className="flex items-center space-x-1 mt-1">
              <CheckCircle className="h-4 w-4" />
              <span>Sent: {format(new Date(message.sentAt), 'MMM dd, yyyy HH:mm')}</span>
            </p>
          )}
        </div>

        {message.status === 'pending' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(message)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit message"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(message.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete message"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
