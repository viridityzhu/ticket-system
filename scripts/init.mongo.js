db.traveler.remove({});
db.blacklist.remove({});

const travelerDB = [
  {
    serialNo: 1, name: 'Jiayin', phone: 12345678, 
    created: Date.now(),
  },
  {
    serialNo: 2, name: 'Zhu', phone: 12222222, 
    created: Date.now(),
  },
];

db.traveler.insertMany(travelerDB);
const count = db.traveler.count();
print('Inserted', count, 'traveler');

db.counters.remove({ _id: 'traveler' });
db.counters.insert({ _id: 'traveler', current: count });

db.traveler.createIndex({ id: 1 }, { unique: true });
db.traveler.createIndex({ created: 1 });
db.blacklist.createIndex({ name: 1 });
db.blacklist.createIndex({ phone: 1 });