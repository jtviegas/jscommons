'use strict';

const winston = require('winston');

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
    , getConfiguration: (spec, config, then) => {
        console.log("[getConfiguration|in] spec:", spec, "config:", config);
        let r = {};
        Object.keys(spec).forEach( internalVariable => {
            let externalVariable = spec[internalVariable];
            if( config[externalVariable] )
                r[internalVariable] = config[externalVariable];
            else if ( process.env[externalVariable] )
                r[internalVariable] = process.env[externalVariable];

            if( r[internalVariable] &&  (typeof then === "function") )
                then(r, internalVariable);

        });
        console.log("[getConfiguration|out] =>", r);
        return r;
    }
    , handleListVariables: (variable, obj) => {
        console.log("[handleListVariables|in] variable:", variable, "obj:", obj);

        if( variable.endsWith("_LIST") ){
            let val = obj[variable];
            obj[variable] = val.split(',');
        }

        console.log("[handleListVariables|out] =>", obj);
        return obj;
    }
    , getDefaultWinstonConfig: () => {
        return {
                level: 'debug',
                format: winston.format.combine(
                    winston.format.splat(),
                    winston.format.timestamp(),
                    winston.format.printf(info => {
                            return `${info.timestamp} ${info.level}: ${info.message}`;
                        })
                    ),
                transports: [new winston.transports.Console()]
        }
    }

}

module.exports = {};
module.exports.commons = commons;
module.exports.ServerError = ServerError;