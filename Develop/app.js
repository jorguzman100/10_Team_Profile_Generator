const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

// npm path: https://www.npmjs.com/package/path
// The path.resolve() method resolves a sequence of paths or path segments into an absolute path.
// Using __dirname is the absolute path to the directory containing the source file. When you use path.resolve or path.join they will return the same result if you give the same path following __dirname. In such cases it's really just a matter of preference.
const OUTPUT_DIR = path.resolve(__dirname, "output");

// The path.join() method joins all given path segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { listenerCount } = require("process");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

const teamMembers = [];

const selectEmployeeType = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'emploType',
            message: 'Select a employee type to create:',
            choices: ['Manager', 'Engineer', 'Intern', 'No more employees'],
            default: 'Engineer',
        },
    ]).then((answer) => {
        if (answer.emploType === 'No more employees') {
            createHTMLFile();
        } else {
            inputBasicInfo(answer);
        }
    });
};

const inputBasicInfo = (answer) => {
    inquirer.prompt([
        {
            name: 'name',
            message: 'Name: ',
            default: 'Employee Name',
        },
        {
            name: 'id',
            message: 'id: ',
            default: '001',
        },
        {
            name: 'email',
            message: 'Email: ',
            default: 'employee@getdigital.com',
        },
    ]).then((basicInfo) => {
        inputSpecificInfo(answer, basicInfo);
    });
}

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.
const inputSpecificInfo = (answer, basicInfo) => {
    switch (answer.emploType) {
        case 'Manager':
            inquirer.prompt([
                {
                    name: 'officeNumber',
                    message: 'Office number: ',
                    default: '05',
                },
            ]).then((specificInfo) => {
                const aManger = new Manager(basicInfo.name, basicInfo.id, basicInfo.email, specificInfo.officeNumber);
                teamMembers.push(aManger);
                selectEmployeeType();
            });
            break;
        case 'Engineer':
            inquirer.prompt([
                {
                    name: 'github',
                    message: 'GitHub user: ',
                    default: 'gitHubUser',
                },
            ]).then((specificInfo) => {
                const anEngineer = new Engineer(basicInfo.name, basicInfo.id, basicInfo.email, specificInfo.github);
                teamMembers.push(anEngineer);
                selectEmployeeType();
            });
            break;
        case 'Intern':
            inquirer.prompt([
                {
                    name: 'school',
                    message: 'School: ',
                    default: 'Tec de Monterrey',
                },
            ]).then((specificInfo) => {
                const anIntern = new Intern(basicInfo.name, basicInfo.id, basicInfo.email, specificInfo.school);
                teamMembers.push(anIntern);
                selectEmployeeType();
            });
            break;
    }
}


const createHTMLFile = () => {
    // After the user has input all employees desired, call the `render` function (required
    // above) and pass in an array containing all employee objects; the `render` function will
    // generate and return a block of HTML including templated divs for each employee!
    const html = render(teamMembers);

    // Hint: you may need to check if the `output` folder exists and create it if it
    // does not.
    // Source: 'How to create a directory if it doesn't exist using Node.js?'
    // https://stackoverflow.com/questions/21194934/how-to-create-a-directory-if-it-doesnt-exist-using-node-js
    let dir = './output';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    // After you have your html, you're now ready to create an HTML file using the HTML
    // returned from the `render` function. Now write it to a file named `team.html` in the
    // `output` folder. You can use the variable `outputPath` above target this location.
    fs.writeFile(outputPath, html, (error) => {
        if (error) {
            console.log('There was an error: ', error);
        } else {
            console.log('HTML file created!');
        }
    });
}

selectEmployeeType();