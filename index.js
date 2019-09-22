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

    getTableNameV1 : (tenant, entity, environment, entities, environments) => {

        if( -1 === entities.indexOf(entity) )
            throw new Error('table not enabled: ' + entity);

        let result = `${tenant}_${entity}`;
        if (null !== environment){
            if( -1 === environments.indexOf(environment) )
                throw new Error('environment not enabled: ' + environment);
            result += '_' + environment;
        }

        return result;
    }
    , getTableNameV2 : (appname, entity, environment, environments) => {

        let result = `${appname}_${entity}`;
        if (null !== environment){
            if( -1 === environments.indexOf(environment) )
                throw new Error('environment not enabled: ' + environment);
            result += '_' + environment;
        }

        return result;
    }
    , getTableNameV3 : (appname, entity, environment) => {
        return `${appname}_${entity}_${environment}`;
    }
    , configByEnvironment: (config, variables, defaults, rangeSuffix, splitVariables) => {

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
        console.log("[jscommons.getConfiguration|in] spec:", spec, "config:", config);
        let r = {};
        Object.keys(spec).forEach( internalVariable => {
            let externalVariable = spec[internalVariable];
            // if we have it in config then take it
            if( config[externalVariable] )
                r[internalVariable] = config[externalVariable];
            // if not in config check environment
            else if ( process.env[externalVariable] )
                r[internalVariable] = process.env[externalVariable];

            if( r[internalVariable] &&  (typeof then === "function") )
                then(internalVariable, r);

        });
        console.log("[jscommons.getConfiguration|out] =>", r);
        return r;
    }
    , mergeConfiguration: (config1, config2) => {
        console.log("[jscommons.mergeConfiguration|in] :config1:", config1, "config2:", config2);
        let r = {};
        Object.keys(config1).forEach( key => r[key] = config1[key] );
        Object.keys(config2).forEach( key => r[key] = config2[key] );
        console.log("[jscommons.mergeConfiguration|out] =>", r);
        return r;
    }
    , handleListVariables: (variable, obj) => {
        console.log("[jscommons.handleListVariables|in] variable:", variable, "obj:", obj);
        if( variable.endsWith("_LIST") ){
            let idx = variable.lastIndexOf("_LIST");
            let new_variable = variable.substring(0,idx);
            if( !obj[new_variable] ){
                let val = obj[variable];
                obj[new_variable] = val.split(',');
            }
        }
        console.log("[jscommons.handleListVariables|out] =>", obj);
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
    , getEnvironmentConfiguration: (spec, then) => {
        console.log("[jscommons.getEnvironmentConfiguration|in] spec:", spec);
        let r = {};
        Object.keys(spec).forEach( internalVariable => {
            let externalVariable = spec[internalVariable];
            if ( process.env[externalVariable] )
                r[internalVariable] = process.env[externalVariable];

            if( r[internalVariable] &&  (typeof then === "function") )
                then(internalVariable, r);

        });
        console.log("[jscommons.getEnvironmentConfiguration|out] =>", r);
        return r;
    }

}

module.exports = {};
module.exports.commons = commons;
module.exports.ServerError = ServerError;