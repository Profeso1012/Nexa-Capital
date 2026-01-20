const { MongoClient, ServerApiVersion } = require('mongodb');
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

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db('nexa_capital');
    
    // Create collections
    console.log('\n📦 Creating collections...');
    const collections = ['users', 'wallets', 'transactions', 'investment_plans', 'investments', 'referrals'];
    
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`  ✅ Created: ${collectionName}`);
      } catch (error) {
        if (error.codeName === 'NamespaceExists') {
          console.log(`  ℹ️  Already exists: ${collectionName}`);
        } else {
          throw error;
        }
      }
    }
    
    // Create indexes
    console.log('\n🔍 Creating indexes...');
    
    const users = db.collection('users');
    await users.createIndex({ email: 1 }, { unique: true });
    await users.createIndex({ username: 1 }, { unique: true });
    await users.createIndex({ referralCode: 1 }, { unique: true });
    console.log('  ✅ Users indexes created');
    
    const wallets = db.collection('wallets');
    await wallets.createIndex({ userId: 1 }, { unique: true });
    console.log('  ✅ Wallets indexes created');
    
    const transactions = db.collection('transactions');
    await transactions.createIndex({ userId: 1 });
    await transactions.createIndex({ status: 1 });
    await transactions.createIndex({ type: 1 });
    await transactions.createIndex({ createdAt: -1 });
    console.log('  ✅ Transactions indexes created');
    
    const investmentPlans = db.collection('investment_plans');
    await investmentPlans.createIndex({ name: 1 }, { unique: true });
    console.log('  ✅ Investment plans indexes created');
    
    const investments = db.collection('investments');
    await investments.createIndex({ userId: 1 });
    await investments.createIndex({ status: 1 });
    await investments.createIndex({ startDate: -1 });
    console.log('  ✅ Investments indexes created');
    
    const referrals = db.collection('referrals');
    await referrals.createIndex({ referrerId: 1 });
    await referrals.createIndex({ referredUserId: 1 }, { unique: true });
    console.log('  ✅ Referrals indexes created');
    
    console.log('\n🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Initialization failed:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Connection closed.');
  }
}

initializeDatabase();
