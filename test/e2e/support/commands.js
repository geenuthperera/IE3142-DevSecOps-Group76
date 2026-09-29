(function() {
  "use strict";

  Cypress.Commands.add("signIn", (usr, pw) => {
    cy.visitPage("/login");
    cy.get("#userName").type(usr);
    cy.get("#password").type(pw);
    cy.get("[type='submit']").click();
  });

  Cypress.Commands.add("adminSignIn", () => {
    const password = Cypress.env("SEED_ADMIN_PASSWORD");

    if (!password) {
      throw new Error(
        "SEED_ADMIN_PASSWORD Cypress environment variable is required"
      );
    }

    cy.fixture("users/admin.json").as("admin");
    cy.get("@admin").then(admin => {
      cy.signIn(admin.user, password);
    });
  });

  Cypress.Commands.add("userSignIn", () => {
    const password = Cypress.env("SEED_USER1_PASSWORD");

    if (!password) {
      throw new Error(
        "SEED_USER1_PASSWORD Cypress environment variable is required"
      );
    }

    cy.fixture("users/user.json").as("user");
    cy.get("@user").then(user => {
      cy.signIn(user.user, password);
    });
  });

  Cypress.Commands.add("visitPage", (path = "/", config = {}) => {
    cy.visit(path, config);
  });

  Cypress.Commands.add("dbReset", () => {
    cy.exec("npm run db:seed", {
      timeout: 6000,
      failOnNonZeroExit: false
    });
  });

}());
