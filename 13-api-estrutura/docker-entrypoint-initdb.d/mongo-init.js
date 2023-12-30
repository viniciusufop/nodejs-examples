print("Started Adding the Users.");
db = db.getSiblingDB("heroes");
db.createUser({
  user: "testuser",
  pwd: "testuser123",
  roles: [{ role: "readWrite", db: "heroes" }],
});
print("End Adding the User Roles.");