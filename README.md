# zip-db
Lightweight JSON based Database implementation for NodeJS, which is designed for a small volume of stored data.
No additional Database drivers are required.

**The Database will be**:
- persisted in the local file system
- encrypted with `aes-256-ctr`
- compressed

### Example
```JavaScript
const ZipDb = require("zip-db");

// Initialize a database that will be persisted in the file "mydb.db".
// The database will be encrypted by using the password "my-password".
const db = new ZipDb(__dirname + "/mydb.db", "my-password");

// add a new collection if it does not exist yet
const peopleCollection = db.hasCollection("people")
  ? db.getCollection("people")
  : db.createCollection("people");

// add a new document to the collection
const johnCenasId = peopleCollection.add({
  firstName: "John",
  lastName: "Cena",
  symbol: "💪🏻",
});

// get an array of all entities in the collection
const allPeople = peopleCollection.getAll();

// get a specific document from the collection
const johnCena = peopleCollection.getById(johnCenasId);

// update john cena
const updatedJohnCena = peopleCollection.update(johnCenasId, {
  firstName: "John",
  lastName: "Cena",
  symbol: "🥊",
});

// delete a document from the collection
peopleCollection.removeById(johnCenasId);

// remove all entites from collectoin
peopleCollection.truncate();

// add a collection of fruits
const fruitCol =  db.createCollection("fruits");
fruitCol.add({ name: 'Apple', symbol: '🍎' });
fruitCol.add({ name: 'Banana', symbol: '🍌' });
fruitCol.add({ name: 'Melon', symbol: '🍉' });

// print all documents of all collections
db.getAllCollections().forEach(col => {
    console.log(col.name, col.getAll());
});

// remove the fruit collection
db.removeCollection('fruits');

// persist changes to database
db.persist();
```
