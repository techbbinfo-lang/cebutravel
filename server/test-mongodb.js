const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://bbtech:Smoker123@cebutravel.px5bx8c.mongodb.net/?appName=CebuTravel";
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
  console.log("❌ MongoDB Connection Failed:", err.message);
  process.exit(1);
});
