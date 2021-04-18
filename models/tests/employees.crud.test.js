const Employee = require("../employees.model.js");
const expect = require("chai").expect;
const mongoose = require("mongoose");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;

describe("Employee", () => {
  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();

      const uri = await fakeDB.getUri();

      mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.log(err);
    }
  });
  after(() => {
    mongoose.models = {};
  });
  describe("Reading data", () => {
    before(async () => {
      const testEmpOne = new Employee({
        firstName: "Joe",
        lastName: "doe",
        department: "IT",
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: "Joanna",
        lastName: "dolittl",
        department: "Management",
      });
      await testEmpTwo.save();
    });
    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });
    it('should return a proper document by "firstName" with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: "Joanna" });
      expect(employee.firstName).to.be.equal("Joanna");
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });
  describe("Creating data", () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({
        firstName: "Tom",
        lastName: "Tannenbau",
        department: "Controlling",
      });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe("Updating data", () => {
    before(async () => {
      const testEmpOne = new Employee({
        firstName: "Joe",
        lastName: "doe",
        department: "IT",
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: "Joanna",
        lastName: "dolittl",
        department: "Management",
      });
      await testEmpTwo.save();
    });
    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ name: "Joe" }, { $set: { name: "Johny" } });
      const updatedEmployee = await Employee.findOne({
        name: "Johny",
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const Employee = await Employee.findOne({ name: "Joe" });
      Employee.name = "Johny";
      await Employee.save();

      const updatedEmployee = await Employee.findOne({
        name: "Johny",
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { name: "Updated!" } });
      const Employees = await Employee.find({ name: "Updated!" });
      expect(Employees.length).to.be.equal(2);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe("Removing data", () => {
    before(async () => {
      const testEmpOne = new Employee({
        firstName: "Joe",
        lastName: "doe",
        department: "IT",
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: "Joanna",
        lastName: "dolittl",
        department: "Management",
      });
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      const Employee = await Employee.deleteOne({ name: "Joe" });
      const removeEmployee = await Employee.findOne({
        name: "Joe",
      });
      expect(removeEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const Employee = await Employee.findOne({ name: "Joanna" });
      await Employee.remove();
      const removedEmployee = await Employee.findOne({
        name: "Joanna",
      });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const Employees = await Employee.find();
      expect(Employees.length).to.be.equal(0);
    });
    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
});
