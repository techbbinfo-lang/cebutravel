// MongoDB Playground - Test Connection
use('cebutravel');

// Test: Insert a document
db.collection('test').insertOne({
  name: 'CebuTravel Test',
  created: new Date(),
  status: 'connected'
});

// Test: Find all documents
db.collection('test').find({}).toArray();
