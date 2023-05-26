INSERT INTO department (name)
VALUES ("Engineering"),
("Finance"),
("Legal"),
("Sales");

SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
VALUES ("quality control", 150000, 1),
("Account Manager", 20000, 2),
("Associate Attorney", 350000, 3),
("Chief sales", 300000, 4),
("Sales Support", 95000, 4);

SELECT * FROM role;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Zeialh", "Reyna", 3, 1),
("Faidy", "Aguilar", 4, 2),
("Abby", "Brandenburg", 4, 2),
("Morgan", "Davenport", 3, 1),
("Matthew", "Pollak", 1, 3),
("Lionel", "Messi", 4, 4),
("Mary", "lozano", 2, 3),
("Vince", "Vaughn", 1, 4),
("Justin", "Bieber", 4, 4);

SELECT * FROM employees;
