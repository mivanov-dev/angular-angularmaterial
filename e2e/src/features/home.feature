
Feature: Test Home page

    Scenario: Start application and open first "home" page

        Given web browser is on home page
        When I load application
        Then I should see the loading indicator
        And I should see the title "AngularAngularMaterial"
        When I finish with the loading process
        Then I should't see more loading indicator
        And I should see the title "Home | AngularAngularMaterial"
