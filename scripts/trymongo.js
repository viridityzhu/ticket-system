const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/ticketsys';

// Atlas URL  - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';

// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';

function testWithCallbacks(callback) {
  console.log('\n--- testWithCallbacks ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  client.connect(function(err, client) {
    if (err) {
      callback(err);
      return;
    }
    console.log('Connected to MongoDB');

    console.log('Testing Create WithCallbacks...');
    const db = client.db();
    const collection = db.collection('traveler');

    const traveler1 = {
      serialNo: 1, name: 'Zhu', phone: 12222222, 
      created: Date.now(),
    };
    collection.insertOne(traveler1, function(err, result) {
      if (err) {
        client.close();
        callback(err);
        return;
      }
      console.log('Result of create:\n', result.insertedId);
      client.close();
      console.log('Create WithCallbacks Succeeded.');
      callback(err);
      });


    console.log('Testing Read WithCallbacks...');

    collection.find({ name: "Zhu"})
      .toArray(function(err, docs) {
      if (err) {
        client.close();
        callback(err);
        return;
      }
      console.log('Result of read:\n', docs);
      client.close();
      console.log('Read WithCallbacks Succeeded.');
      callback(err);
    });

    console.log('Testing Update WithCallbacks...');
    
    collection.updateOne({ id: 1 }, { $set: {name: "Jiayin" } }, function(err, docs) {
      if (err) {
        client.close();
        callback(err);
        return;
      }
      console.log('Result of update:\n', docs.result);
      client.close();
      console.log('Update WithCallbacks Succeeded.');
      callback(err);
    });

    console.log('Testing Delete WithCallbacks...');

    collection.deleteOne({ id: 1 }, function(err, docs) {
      if (err) {
        client.close();
        callback(err);
        return;
      }
      console.log('Result of delete:\n', docs.result);
      client.close();
      console.log('Delete WithCallbacks Succeeded.');
      callback(err);
    });
  });
};

async function testWithAsync() {
  console.log('\n--- testWithAsync ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();
    const collection = db.collection('traveler');

    console.log('Testing Create WithAsync...');
    const traveler1 = {
      serialNo: 1, name: 'Zhu', phone: 12222222, 
      created: Date.now(),
    };
    var result = await collection.insertOne(traveler1);
    console.log('Result of create:\n', result.insertedId);

    console.log('Create WithAsync Succeeded.');


    console.log('Testing Read WithAsync...');
    docs = await collection.find({name: "Zhu" })
      .toArray();
    console.log('Result of Read:\n', docs);
    console.log('Read WithAsync Succeeded.');


    console.log('Testing Update WithAsync...');
    result = await collection.updateOne({ id: 1 }, { $set: {name: "Jiayin" } });
    console.log('Result of update:\n', result.result);
    console.log('Update WithAsync Succeeded.');

    console.log('Testing Delete WithAsync...');
    result = await collection.deleteOne({ id: 1 });
    console.log('Result of delete:\n', result.result);
    console.log('Delete WithAsync Succeeded.');
  } catch(err) {
    console.log(err);
  } finally {
    client.close();
  }
}


testWithAsync();
testWithCallbacks(function(err) {
  if (err) {
    console.log(err);
  }
});