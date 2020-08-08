import './commands';

before(() => cy.fixture('adminUser').then((adminUser) => cy.setupDatabase(adminUser)));
