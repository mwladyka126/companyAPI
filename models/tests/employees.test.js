const Employee = require("../employees.model.js");
const expect = require("chai").expect;
const mongoose = require("mongoose");

describe("Employee", () => {
  it("should throw an error if no arg", () => {
    const emp = new Employee({});
    emp.validate((err) => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });
  it("should throw an error if some arg are missing", () => {
    const emp1 = { firstName: "Joe", lastName: "doe" };
    const emp2 = { firstName: "Joe", department: "IT" };
    const emp3 = { lastName: "Joe", department: "IT" };
    const emp4 = { firstName: "Joe" };
    const emp5 = { lastName: "doe" };
    const emp6 = { department: "IT" };
    const cases = [emp1, emp2, emp3, emp4, emp5, emp6];
    for (let example of cases) {
      const emp = new Employee(example);
      emp.validate((err) => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should throw an error if "arg" is not a string', () => {
    const emp1 = { firstName: {} };
    const emp2 = { firstName: [] };
    const emp3 = { lastName: {} };
    const emp4 = { lastName: [] };
    const emp5 = { department: {} };
    const emp6 = { department: [] };
    const cases = [emp1, emp2, emp3, emp4, emp5, emp6];
    for (let example of cases) {
      const emp = new Employee(example);

      emp.validate((err) => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should throw no error if all "arg" are correct', () => {
    const emp1 = { firstName: "Joe", lastName: "doe", department: "IT" };
    const emp2 = {
      firstName: "Joanne",
      lastName: "doellit",
      department: "Management",
    };
    const cases = [emp1, emp2];
    for (let example of cases) {
      const emp = new Employee(example);

      emp.validate((err) => {
        expect(err).to.not.exist;
      });
    }
  });
});
