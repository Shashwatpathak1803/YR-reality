// One-time script to create the first Super Admin account.
// Usage: node src/seed/createAdmin.js "Admin Name" admin@example.com "StrongPass123"
import { connectDB } from '../config/db.js';
import { Admin } from '../models/admin.model.js';
import { ROLES } from '../constants/roles.js';
import mongoose from 'mongoose';

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.error('Usage: node src/seed/createAdmin.js "Admin Name" admin@example.com "StrongPass123"');
  process.exit(1);
}

(async () => {
  await connectDB();
  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin with email ${email} already exists.`);
  } else {
    await Admin.create({ name, email, password, role: ROLES.SUPER_ADMIN });
    console.log(`✅ Super admin created: ${email}`);
  }
  await mongoose.disconnect();
  process.exit(0);
})();
