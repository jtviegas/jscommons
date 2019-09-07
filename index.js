'use strict';

class ServerError extends Error {
    constructor(message, status) {
        super(message); // (1)
        this.name = "ServerError"; // (2)
        this.status = status;
    }
}

const commons = {

    configByEnvironment: (config, variables, defaults, rangeSuffix, splitVariables) => {

        for(let i in variables){

            let variable = variables[i];
            let defaultValue = defaults[i];

            if ( process.env[variable] ){

                let value = null;
                if( splitVariables && 0 < splitVariables.length &&  -1 < splitVariables.indexOf(variable) ){
                    let list = process.env[variable];
                    value = list.split(',');
                }
                else
                    value = process.env[variable];

                let rangeVariable = variable + rangeSuffix;
                if( config[rangeVariable] ){
                    let range = config[rangeVariable];
                    if( -1 === range.indexOf(value) )
                        throw new Error('!!! variable: ' + variable + ' has an invalid value: ' + value + ' !!!');
                }

                config[variable] = value;
            }
            else
                config[variable] = defaultValue;

        }

        return config;
    }
    , configByDecoration: (config, variables, defaults, decoration, rangeSuffix, splitVariables) => {

        for(let i in variables){

            let variable = variables[i];
            let defaultValue = defaults[i];

            if ( decoration[variable] ){

                let value = null;
                if( splitVariables && 0 < splitVariables.length &&  -1 < splitVariables.indexOf(variable) ){
                    let list = decoration[variable];
                    value = list.split(',');
                }
                else
                    value = decoration[variable];

                let rangeVariable = variable + rangeSuffix;
                if( config[rangeVariable] ){
                    let range = config[rangeVariable];
                    if( -1 === range.indexOf(value) )
                        throw new Error('!!! variable: ' + variable + ' has an invalid value: ' + value + ' !!!');
                }

                config[variable] = value;
            }
            else
                config[variable] = defaultValue;

        }

        return config;
    }
    , getConfiguration: (spec, config) => {
        console.log("[getConfiguration|in] config:", config);
        let r = {};
        for (let key in spec) {
            if (spec.hasOwnProperty(key)) {
                if( config[key] )
                    r[key] = config[key];
                else if ( process.env[key] )
                    r[key] = process.env[key];
            }
        }
        console.log("[getConfiguration|out] =>", r);
        return r;
    }

}

module.exports = {};
module.exports.commons = commons;
module.exports.ServerError = ServerError;