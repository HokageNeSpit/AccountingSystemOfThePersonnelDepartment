const fs = require("fs");

const { createGzip } = require('zlib');
const { pipeline } = require('stream');
const {
  createReadStream,
  createWriteStream
} = require('fs');
const { promisify } = require('util');
const pipe = promisify(pipeline);

const gzip = createGzip();
const source = createReadStream('database/database.txt');
const destination = createWriteStream('backup/database.txt.gz');

pipeline(source, gzip, destination, (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  });

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipe(source, gzip, destination);
}

class SaveData {

    static save(data) {
        let dataString = JSON.stringify(data, null, '\t');
        fs.writeFile("database/database.txt", dataString, function(error){
            if(error) throw error; 
            console.log("Saved!");
        });
    }

    static show() {
        fs.readFile("database/database.txt", "utf8", function(error,data){
            console.log(JSON.parse(data));
            
        });
    }

    static backup(iteration) {
        do_gzip('database/database.txt', `backup/database${iteration}.txt.gz`)
            .catch((err) => {
                console.error('An error occurred:', err);
                process.exitCode = 1;
        });
    }
}

module.exports = SaveData;