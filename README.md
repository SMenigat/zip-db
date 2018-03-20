# json-db
Simple JSON Database for NodeJS 💾

### Example
```JavaScript
const JsonDb = require("json-db");

// initialize json-db
const db = new JsonDb(__dirname + "/db.json");

// add new collection if not exists
const peopleCollection = db.hasCollection("people")
  ? db.getCollection("people")
  : db.createCollection("people");

// add a new document to the store
const johnCenasId = peopleCollection.add({
  firstName: "John",
  lastName: "Cena"
});

// get an array of all entities in the collection
const allPeople = peopleCollection.getAll();

// get a specific document from the collection
const johnCena = peopleCollection.getById(johnCenasId);

// delete a document from the collection
peopleCollection.removeById(johnCenasId);

// remove all entites from collectoin
peopleCollection.truncate();

// persist changes to database
db.persist();
```
