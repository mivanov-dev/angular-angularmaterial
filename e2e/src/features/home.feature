Feature: Test Home page

    Scenario: Start application and open first "home" page
        Given Start application
        When I see the loading indicator
        Then I should see the loading indicator
        Then I should see the title "AngularAngularMaterial"
        When I am done with the loading process
        Then I should't see more loading indicator
        Then I should see the title "Home | AngularAngularMaterial"