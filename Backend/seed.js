require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('./src/models/role.model');

async function seedRoles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const roles = ['student', 'admin', 'instructor'];
    
    for (const roleName of roles) {
      const exists = await Role.findOne({ name: roleName });
      if (!exists) {
        await Role.create({
          name: roleName,
          description: `${roleName.charAt(0).toUpperCase() + roleName.slice(1)} role`,
          permissions: roleName === 'admin' ? ['all'] : ['read']
        });
        console.log(`Created role: ${roleName}`);
      } else {
        console.log(`Role ${roleName} already exists`);
      }
    }
    
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
}

seedRoles();
