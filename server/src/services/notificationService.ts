import { emitToUser, emitToRole, emitToAll } from './socketManager';
import { IAlert } from '../models/Alert';
import User from '../models/User';
import { sendEmail } from './emailService';
import { sendSMS } from './smsService';

export const broadcastAlert = async (alert: IAlert): Promise<void> => {
  const alertData = {
    _id: alert._id,
    title: alert.title,
    message: alert.message,
    priority: alert.priority,
    disaster: alert.disaster,
    targetRoles: alert.targetRoles,
    location: alert.location,
    createdAt: alert.createdAt,
  };

  if (alert.targetRoles && alert.targetRoles.length > 0) {
    for (const role of alert.targetRoles) {
      emitToRole(role, 'new-alert', alertData);
    }

    const recipients = await User.find({
      role: { $in: alert.targetRoles },
      isActive: true,
    }).select('email phone name');

    for (const recipient of recipients) {
      if (recipient.email) {
        sendEmail({
          to: recipient.email,
          subject: `🚨 ${alert.priority.toUpperCase()}: ${alert.title}`,
          text: `${alert.message}\n\n— Emergency Alerts System`,
        });
      }
      if (recipient.phone) {
        sendSMS({
          to: recipient.phone,
          message: `[${alert.priority.toUpperCase()}] ${alert.title}: ${alert.message}`,
        });
      }
    }
  } else {
    emitToAll('new-alert', alertData);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`Alert broadcast: ${alert.title}`);
  }
};

export const notifyTaskUpdate = (userId: string, task: any): void => {
  emitToUser(userId, 'task-update', task);
};

export const notifyResourceUpdate = (resource: any): void => {
  emitToAll('resource-update', resource);
};
