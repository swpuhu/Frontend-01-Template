const Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option('babel');
    }

    method2 () {
        console.log('method2 run');
    }

    method1 () {
        console.log('method1 run.');
    }

    async prompting () {
        const answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your project name",
                default: this.appname
            },
            {
                type: "confirm",
                name: "cool",
                message: "Would you like to enable the cool feature?"
            }
        ]);

        this.log("app name", answers.name);
        this.log("cool feature", answers.cool);
    }
}