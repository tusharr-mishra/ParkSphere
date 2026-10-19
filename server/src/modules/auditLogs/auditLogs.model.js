import mongoose from 'mongoose';

const auditLogsSchema = new mongoose.Schema(
  {},
  { timestamps: true, strict: false }
);

export const AuditLogsModel =
  mongoose.models.AuditLogs ||
  mongoose.model('AuditLogs', auditLogsSchema);
