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
    addBlacklist,
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

async function addTraveler(_, { Traveler }) {
  if (await db.collection('traveler').find({}).count() >= 25){
    return {valid: 0, msg: "Reservation list is already full. You cannot book anymore."};
  }
  else if (await db.collection('blacklist').find({name:Traveler.name}).count() + await db.collection('blacklist').find({phone:Traveler.phone}).count() > 0) {
    return {valid: 0, msg: "This name or phone is in the blacklist. You can't book a ticket."};
  }
  else {
    Traveler.serialNo = await getNextSequence('traveler');
    Traveler.created = Date.now().toString();
    await db.collection('traveler').insertOne(Traveler);
    return {valid: 1, msg: "Successfully booked a new ticket."};
  }
};
async function addBlacklist(_, { Traveler }) {
  name = Traveler.name; phone = Traveler.phone;
  if (!(name === null || name === undefined || name === "") ) {
    const hit = await db.collection('blacklist').find({name:name}).count();
    if (hit>0) {
      return {valid: 0, msg:"This traveler has already been blocked."};
    }
  }
  else if (!(phone === null || phone === undefined || phone === "" )) {
    const hit = await db.collection('blacklist').find({phone:phone}).count();
    if (hit>0) {
      return {valid: 0, msg:"This phone has already been blocked."};
    }
  }
  await db.collection('blacklist').insertOne(Traveler);
  return {valid: 1, msg: "Successfully added into the blacklist."};
};

async function deleteTraveler(_, { serialNo }) {
  if (await db.collection('traveler').find({serialNo:serialNo}).count() == 0) {
    return {valid: 0, msg:"This record doesn't exist."};
  }
  else {
    await db.collection('traveler').deleteOne({ serialNo: serialNo }); 
    return {valid: 1, msg:"Ticket cancelled."};
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
