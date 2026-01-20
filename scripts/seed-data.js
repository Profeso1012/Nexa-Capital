const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI is not defined in .env file');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function seedData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db('nexa_capital');
    
    // Create admin user
    console.log('\n👤 Creating admin user...');
    const users = db.collection('users');
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
      process.exit(1);
    }
    
    const existingAdmin = await users.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('  ℹ️  Admin user already exists');
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser = {
        username: 'admin',
        email: adminEmail,
        password: hashedPassword,
        country: 'USA',
        countryCode: '+1',
        phone: '0000000000',
        referralCode: 'ADMIN001',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await users.insertOne(adminUser);
      const adminId = result.insertedId.toString();
      
      // Create admin wallet
      const wallets = db.collection('wallets');
      await wallets.insertOne({
        userId: adminId,
        balance: 0,
        pendingDeposits: 0,
        pendingWithdrawals: 0,
        totalEarnings: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('  ✅ Admin user created successfully');
    }
    
    // Create investment plans
    console.log('\n💼 Creating investment plans...');
    const plans = db.collection('investment_plans');
    
    const investmentPlans = [
      {
        name: 'Starter Plan',
        badge: 'Popular',
        description: 'Perfect for beginners looking to start their investment journey',
        dailyRate: 2.5,
        minAmount: 100,
        maxAmount: 999,
        duration: 30,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Growth Plan',
        badge: 'Best Value',
        description: 'Ideal for growing your portfolio with better returns',
        dailyRate: 3.5,
        minAmount: 1000,
        maxAmount: 4999,
        duration: 45,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Premium Plan',
        badge: 'Premium',
        description: 'Maximum returns for serious investors',
        dailyRate: 5.0,
        minAmount: 5000,
        maxAmount: 19999,
        duration: 60,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Elite Plan',
        badge: 'VIP',
        description: 'Exclusive plan for high-net-worth individuals',
        dailyRate: 7.5,
        minAmount: 20000,
        maxAmount: 100000,
        duration: 90,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    for (const plan of investmentPlans) {
      const existing = await plans.findOne({ name: plan.name });
      if (existing) {
        console.log(`  ℹ️  ${plan.name} already exists`);
      } else {
        await plans.insertOne(plan);
        console.log(`  ✅ Created: ${plan.name} (${plan.dailyRate}% daily)`);
      }
    }
    
    console.log('\n🎉 Seed data completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Login as admin using your ADMIN_EMAIL and ADMIN_PASSWORD from .env');
    console.log('  2. Access admin panel at: /admin');
    console.log('  3. Start creating users and managing transactions!');
    
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed.');
  }
}

seedData();
