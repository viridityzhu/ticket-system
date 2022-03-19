const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/ticketsys';

let db;
let aboutMessage = "Ticket System for Tut4";

const resolvers = {
  Query: {
    about: () => aboutMessage,
    readTraveler,
  },
  Mutation: {
    addTraveler,
    deleteTraveler,
  },
};

async function readTraveler() {
  const travelers = await db.collection('traveler').find({}).toArray();
  return travelers;
};

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
};

async function addTraveler(_, { traveler }) {
  if (db.traveler.count() >= 25){
    return "Reservation list is already full. You cannot book anymore.";
  }
  else {
    traveler.serialNo = await getNextSequence('traveler');
    traveler.created = Date.now().toString();
    const result = await db.collection('traveler').insertOne(traveler);
    const savedTraveler = await db.collection('traveler')
      .findOne({ _id: result.insertedId });
    return "Successfully booked a new ticket.";
  }
};

async function deleteTraveler(_, { serialNo }) {
  if (!db.collection('traveler').find({serialNo:serialNo}).count() == 0) {
    return "This record doesn't exist.";
  }
  else {
    db.collection('traveler').deleteOne({ serialNo: serialNo }); 
    return "Ticket cancelled.";
  }

};

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});

const app = express();

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

(async function () {
  try {
    await connectToDb();
    app.listen(3000, function () {
      console.log('App started on port 3000');
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();
