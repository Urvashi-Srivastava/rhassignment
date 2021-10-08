Feature: As a sdet, I want to download files from google drive

  Background: Setting credentails for google drive api
    Given I have auth credentails to use google drive api

  Scenario Outline: Verify that file is downloaded to local from google api
    When I download <file> from google drive
    Then <file> is downloaded to local machine

    Examples: of file
      | file      |
      | abc.jpg   |
      | hello.jpg |

  Scenario: Verify the error message when file does not exists in the google drive
    When I download abc.jpg from google drive
    Then I get an error message

  Scenario: Verify the message is displayed for downloading the duplicate file
    When I download abc.jpg from google drive twice
    Then I get an error message: File with same name already exists

#verification for doc file is yet not done



