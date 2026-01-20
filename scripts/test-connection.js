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

async function testConnection() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await client.connect();
    
    console.log('✅ Successfully connected to MongoDB!');
    
    await client.db("admin").command({ ping: 1 });
    console.log('✅ Pinged deployment successfully!');
    
    const db = client.db('nexa_capital');
    const collections = await db.listCollections().toArray();
    
    console.log('\n📊 Database: nexa_capital');
    console.log(`📁 Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('\nExisting collections:');
      collections.forEach(col => console.log(`  - ${col.name}`));
    } else {
      console.log('\n⚠️  No collections found. Run "npm run db:init" to initialize the database.');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed.');
  }
}

testConnection();
