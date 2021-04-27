const SaveData = require("./save.js");
const fs = require("fs");
var minutes = 1, the_interval = minutes * 60 * 1000;
let iteration = 0;


class AccountingSystemOfThePersonnelDepartment {
    personal_file;

    constructor() {
        this.personal_file = [];
    }

    add_file(personal_file) {
        this.personal_file.push(personal_file);
        SaveData.save(this.personal_file);
    }

    get_personal_file_by_number(number) {
        return this.personal_file.filter(personal_file => personal_file.number === number);
    }

    get_personal_file_with_index(number) {
        let i = 0;
        let index;
        this.personal_file.forEach(el => {
            if(el.number === number) {
                index =  i;
            }
            i++;
        });
        return index;
    }

    update_personal_file(number, newData) {
        let index = this.get_personal_file_with_index(number);
        this.personal_file[index] = newData;
        SaveData.save(this.personal_file);
    }

    delete_personal_file_by_number(number) {
        let index = this.get_personal_file_with_index(number);
        this.personal_file.splice(index, 1);
        SaveData.save(this.personal_file);
    }
}

class PersonalFile {
    name;
    surname;
    photo;
    number;
    register;

    constructor(name, surname, photo, number, register) {
        this.name = name;
        this.surname = surname;
        this.photo = photo;
        this.number = number;
        this.register = register;
    }
}

function start() {
    let accountingSystemOfThePersonnelDepartment = new AccountingSystemOfThePersonnelDepartment();
    let dataFromBD = fs.readFileSync("database/database.txt", "utf8", function(error,data){        
    });
    let personal_file = JSON.parse(dataFromBD);
    personal_file.forEach(el => accountingSystemOfThePersonnelDepartment.personal_file.push(new PersonalFile(el.name, el.surname, el.photo, el.number, el.register)));
    accountingSystemOfThePersonnelDepartment.update_personal_file(45231, new PersonalFile("Andrey", "Romanov", "URL", 45231, {job:"Manager", since: "2005"}));
}

setInterval(function(error) {
    if(error) throw error;
    SaveData.backup(iteration);
    console.log(`backup/database${iteration}.txt.gz created!`);
    iteration++;
}, the_interval);
start();
SaveData.show();