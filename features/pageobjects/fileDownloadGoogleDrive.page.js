import { pathExists, removeSync } from 'fs-extra'
const { google } = require('googleapis');
const fs = require('fs');
require('dotenv').config()
/**
 * sub page methods for a specific page
 */
const CLIENT_ID = `${process.env.CLIENT_ID}`;
const CLIENT_SECRET = `${process.env.CLIENT_SECRET}`;
const REDIRECT_URI = `${process.env.REDIRECT_URI}`;
const REFRESH_TOKEN = `${process.env.REFRESH_TOKEN}`;

let drive = '';
let fileId = ''

export default function fileDownloadGoogledrive() {
    async function setDriveWithCredentials() {
        const oauth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
        );

        oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

        drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        })

    }

    //finding fileId by using file name
    async function findFileIdByFileName(fileName) {
        //regex to drop extension. 
        let value = false;
        fileName = fileName.replace(/\.[^/.]+$/, "");
        await drive.files.list({
            pageSize: '05',
            fields: 'nextPageToken, files(id, name)',
        }, (err, res) => {
            if (err) return console.log('API Error: ' + err);
            const files = res.data.files;
            if (files.length) {
                files.map((file) => {
                    if (file.name === fileName) {
                        fileId = file.id
                        value = true;
                    }
                    console.log(`${file.name} (${file.id})`);
                });
            } else {
                return 'File Not Found'
            }
        });
        return value
    }
    async function fileDownLoad(file) {
        findFileIdByFileName(file);
        let fileExist;
        const path = `./downloadedFile/${file}`;
        fileExist = await pathExists(path);
        if (fileExist === true) {
            return true;
        } else {
            var dest = fs.createWriteStream(`./downloadedFile/${file}`);  // Please set the filename of the saved file.
            await drive.files.get(
                { fileId: fileId, alt: "media" },
                { responseType: "stream" },
                (err, { data }) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    data
                        .on("end", () => console.log("Done."))
                        .on("error", (err) => {
                            console.log(err);
                            return process.exit();
                        })
                        .pipe(dest);
                }
            )
        }

    }

    async function isFileDownloaded(fileName) {
        let fileExist;
        const path = `./downloadedFile/${fileName}`;
        fileExist = await pathExists(path);
        //delete the file so that automation can run smoothly using the same data
        removeSync(path)
        return fileExist;
    }
    return {
        setDriveWithCredentials,
        fileDownLoad,
        isFileDownloaded,
        findFileIdByFileName
    }
}
