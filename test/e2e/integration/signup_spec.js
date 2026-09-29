/// <reference types="Cypress" />

describe("/signup behaviour", () => {
  "use strict";

  const getRequiredEnv = (name) => {
    const value = Cypress.env(name);

    if (!value) {
      throw new Error(`${name} Cypress environment variable is required`);
    }

    return value;
  };

  before(() => {
    cy.dbReset();
  });

  afterEach(() => {
    cy.visitPage("/logout");
  });

  it("Should not redirect if the user has not logged in", () => {
    cy.visitPage("/signup");
    cy.url().should("include", "signup");
  });

  it("Should not redirect if the user has logged in", () => {
    cy.visitPage("/signup");
    cy.url().should("include", "signup");
  });

  it("Should be a form with inputs", () => {
    cy.visitPage("/signup");
    cy.get("form[role='form']")
      .find("input")
      .should("have.length", 7);
  });

  it("Should new user be added to the system", () => {
    cy.fixture("users/new_user.json").as("newUser");

    cy.get("@newUser").then(newUser => {
      const newUserPassword = getRequiredEnv("E2E_NEW_USER_PASSWORD");

      cy.visitPage("/signup");

      cy.get("#userName")
        .clear()
        .type(newUser.user);

      cy.get("#firstName")
        .clear()
        .type(newUser.firstName);

      cy.get("#lastName")
        .clear()
        .type(newUser.lastName);

      cy.get("#password")
        .clear()
        .type(newUserPassword);

      cy.get("#verify")
        .clear()
        .type(newUserPassword);

      cy.get("button[type='submit']")
        .first()
        .click();

      cy.get(".alert-danger").should("not.be.visible");

      cy.get(".breadcrumb > li")
        .invoke("text")
        .should("eq", " Dashboard");
    });
  });

  it("Should new user be able to login in the system", () => {
    cy.fixture("users/new_user.json").as("newUser");

    cy.get("@newUser").then(newUser => {
      cy.signIn(
        newUser.user,
        getRequiredEnv("E2E_NEW_USER_PASSWORD")
      );

      cy.visitPage("/dashboard");
      cy.url().should("include", "dashboard");
    });
  });
});
