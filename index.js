// Including package needed for this application
const inquirer = require('inquirer');
const db = require('./config/connection');
require('console.table');
// Create an array of questions for user input
// set of questions for viewing of: departments, roles, employees. Adding role, employee or update an employee role
const mainMenu = async () => {
    try {
      const { choice } = await inquirer.prompt([
        {
          type: "list",
          name: "choice",
          message: "What would you like to do?",
          choices: [
            "View all departments", 
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
          ],
        },
      ]);
  
      switch (choice) {
        case "View all departments":
          await viewAllDepartments();
          break;
        case "View all roles":
          await viewAllRoles();
          break;
        case "View all employees":
          await viewAllEmployees();
          break;
        case "Add a department":
          await addDepartment();
          break;
        case "Add a role":
          await addRole();
          break;
        case "Add an employee":
          await addEmployee();
          break;
        case "Update an employee role":
          await updateEmployeeRole();
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const viewAllDepartments = async () => {
    try {
      const [rows] = await db.promise().query("SELECT id, name FROM department");
      console.table(rows);
      await mainMenu();
    } catch (error) {
      console.log(error);
    }
  };
  
  const viewAllRoles = async () => {
    try {
      const [rows] = await db.promise().query(
        "SELECT role.id, role.title, role.salary, department.name AS department_name FROM role INNER JOIN department ON role.department_id = department.id"
      );
      console.table(rows);
      await mainMenu();
    } catch (error) {
      console.log(error);
    }
  };
  
  const viewAllEmployees = async () => {
    try {
      const [rows] = await db.promise().query(
        'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department_name, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id'
      );
      console.table(rows);
      await mainMenu();
    } catch (error) {
      console.log(error);
    }
  };
  
  const addDepartment = async () => {
    try {
      const { name } = await inquirer.prompt({
        type: "input",
        name: "name",
        message: "Enter the name of the department:",
      });
  
      const result = await db
        .promise()
        .query("INSERT INTO department (name) VALUES (?)", [name]);
  
      console.log(`Added ${name} department to the database.`);
      await mainMenu();
    } catch (error) {
      console.log(error);
    }
  };
  
  const addRole = async () => {
    try {
      const { title, salary, department_id } = await inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the name of the role:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary for the role:",
        },
        {
          type: "input",
          name: "department_id",
          message: "Enter the department ID for the role:",
        },
      ]);
  
      const result = await db
        .promise()
        .query(
          "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
          [title, salary, department_id]
        );
  
      console.log(`Added ${title} role to the database.`);
      await mainMenu();
    } catch (error) {
      console.log(error);
    }
  };
  
  const addEmployee = async () => {
    try {
      const [roles] = await db.promise().query("SELECT * FROM role");
      const [employees] = await db.promise().query(
        "SELECT * FROM employee WHERE manager_id IS NULL"
      );
  
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id,
      }));
  
      const managerChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));
  
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "first_name",
          message: "What's the employee's first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What's the employee's last name?",
        },
        {
          type: "list",
          name: "role",
          message: "What's the employee's role?",
          choices: roleChoices,
        },
        {
          type: "confirm",
          name: "is_manager",
          message: "Is the employee a manager?",
        },
        {
          type: "list",
          name: "manager_id",
          message: "Who is this employee's manager?",
          choices: managerChoices,
          when: (answers) => !answers.is_manager,
        },
      ]);
  
      const { first_name, last_name, role, is_manager, manager_id } = answers;
      const sql =
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
      const params = [first_name, last_name, role, is_manager ? null : manager_id];
      const result = await db.promise().query(sql, params);
  
      console.log(`Added ${first_name} ${last_name} to the database.`);
      await mainMenu();
    } catch (error) {
      console.log(error);
    }
  };
  
  const updateEmployeeRole = async () => {
    try {
      const [employees] = await db.promise().query("SELECT * FROM employee");
      const employeeChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));
  
      const [roles] = await db.promise().query("SELECT * FROM role");
      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));
  
      const answers = await inquirer.prompt([
        {
          type: "list",
          message: "Which employee's role do you want to update?",
          name: "employeeId",
          choices: employeeChoices,
        },
        {
          type: "list",
          message: "Which role do you want to assign the selected employee?",
          name: "roleId",
          choices: roleChoices,
        },
      ]);
  
      await db.promise().query(
        "UPDATE employee SET role_id = ? WHERE id = ?",
        [answers.roleId, answers.employeeId]
      );
  
      console.log("You have successfully updated the employee's role!");
      await mainMenu();
    } catch (error) {
      console.log(error);
    }
  };
  
  mainMenu();