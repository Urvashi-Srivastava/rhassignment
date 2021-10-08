import { Given, When, Then } from '@wdio/cucumber-framework';
import fileDownloadGoogleDrivePageObject from '../pageobjects/fileDownloadGoogleDrive.page'


const fileDownloadGoogleDrive = fileDownloadGoogleDrivePageObject();
let textMessage = ''

Given(/^I have auth credentails to use google drive api$/, async () => {
    await fileDownloadGoogleDrive.setDriveWithCredentials();
});

When(/^I download ([^"]*) from google drive$/, async (file) => {
    await fileDownloadGoogleDrive.fileDownLoad(file);
});

When(/^I download ([^"]*) from google drive twice$/, async (file) => {
    let value = false
    let count = 0;
    while (value != true && count < 3) {
        count++;
        const value = await fileDownloadGoogleDrive.fileDownLoad(file);
        if (value === true) {
            textMessage = 'File with same name already exists'
        }
    }
})

Then(/^([^"]*) is downloaded to local machine$/, async (file) => {
    const value = await fileDownloadGoogleDrive.isFileDownloaded(file);
    console.log("Page object return value", value)
    expect(value).toEqual(true);
});

Then(/^I get an error message$/, async () => {
    const value = await fileDownloadGoogleDrive.findFileIdByFileName('abc.png')
    expect(value).toEqual(false);
});

Then(/^I get an error message: ([^"]*)$/, async (errorMessage) => {
    expect(textMessage).toEqual(errorMessage)
});

