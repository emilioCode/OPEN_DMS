CREATE DATABASE OPEN_DMS;

CREATE TABLE TEAMS(
	id int NOT NULL AUTO_INCREMENT,
    teamName varchar(50) NOT NULL,
    pathRoot text NOT NULL,
	telephoneNumber varchar(50) NULL,
    hostName varchar(30) NULL,
    portNumber int NULL,
    email varchar(50) NULL,
    pass varchar(50) NULL,
    disabled boolean NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE USERS(
	id int NOT NULL AUTO_INCREMENT,
    completeName varchar(255) NOT NULL,
    description text NULL,
    userAccount varchar(20) NOT NULL,
    userPassword varchar(80) NOT NULL,
    teamId int NOT NULL,
    accessLevel varchar(20) NULL,
	createdDate date NOT NULL,
    expirationDate date NOT NULL,
    disabled boolean NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE DOCUMENTS(
    id int NOT NULL AUTO_INCREMENT,
    fileName varchar(50) NOT NULL,
    extension varchar(5) NOT NULL,
    size float NOT NULL,
    teamId int NOT NULL,
    insertionDate date NOT NULL,
    pathAlternative text NULL,
    commentDetail text NULL,
    distinctDetail text NULL,
    idUser int NOT NULL,
    disabled boolean NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);
/*
Example:
Scaffold-DbContext "connection-string" MySql.EntityFrameworkCore -OutputDir Sakila -Schemas sakila,world -f

Scaffold-DbContext "server=127.0.0.1;uid=root;pwd=123456;database=OPEN_DMS" MySql.EntityFrameworkCore -OutputDir Models
*/