const { MongoClient, ServerApiVersion } = require('mongodb');
// Direct connection without SRV (no DNS needed)
const uri = "mongodb://bbtech:Smoker123@cebutravel-shard-00-00.px5bx8c.mongodb.net:27017,cebutravel-shard-00-01.px5bx8c.mongodb.net:27017,cebutravel-shard-00-02.px5bx8c.mongodb.net:27017/?ssl=true&replicaSet=atlas-12m5zh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=CebuTravel";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

client.connect().then(() => {
  client.db("admin").command({ ping: 1 }).then(() => {
    console.log("✅ MongoDB Connected!");
    process.exit(0);
  });
}).catch(err => {
  console.log("❌ Connection Failed:", err.message);
  process.exit(1);
});
