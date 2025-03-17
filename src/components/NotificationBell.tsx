import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { useNotification } from '../contexts/NotificationContext'; // Custom hook for notification context
// Define the notification structure
interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
}
// Define the context for notifications
interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  loading: boolean;
}

const NotificationBell: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);  // State for the menu anchor element
  const { notifications = [], markAsRead, markAllAsRead, loading } = useNotification(); // Retrieve notifications and actions from context

  const handleClick = (event: React.MouseEvent<HTMLElement>) => { // Open menu on bell click
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id); // Mark individual notification as read
    handleClose(); // Close menu after marking as read
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(); // Mark all notifications as read
    handleClose();// Close menu after marking all as readd
  };

  const unreadCount = notifications.filter(n => !n.read).length; // Count unread notifications

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ 
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          mr: 1
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
            overflow: 'auto'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button 
              size="small" 
              onClick={handleMarkAllAsRead}
              sx={{ textTransform: 'none' }}
            >
              Mark all as read
            </Button>
          )}
        </Box>
        
        <Divider />

        {loading ? (
          <MenuItem disabled>
            <Typography variant="body2">Loading...</Typography>
          </MenuItem>
        ) : notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2">No notifications</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem 
              key={notification.id}
              onClick={() => handleMarkAsRead(notification.id)}
              sx={{ 
                py: 1.5,
                px: 2,
                borderLeft: 2,
                borderColor: notification.read ? 'transparent' : 'primary.main'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                    {notification.title}
                  </Typography>
                  {!notification.read && (
                    <CircleIcon sx={{ fontSize: 8, color: 'primary.main' }} />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.timestamp.toLocaleString()}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell; 