Feature: Home page

    Scenario: Home page
        Given Start application
        When I see the loading indicator with id "loading-box"
        Then I should see the title "AngularAngularMaterial"
        And I can not see more loading indicator with id "loading-box"
        Then I should see the title "Home | AngularAngularMaterial"