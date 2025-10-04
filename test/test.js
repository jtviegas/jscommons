const commons = require('../src/backend/index');

describe('index tests', () => {

    describe('...configuration',  () => {

        it('should parse list variables correctly', () => {
            let variable = 'OBJECTS_LIST';
            let new_variable = 'OBJECTS';
            let state = {};
            state[variable] = 'a,b,c,d'

            let configuration = commons.handleListVariables(variable, state);
            expect( configuration[variable] ).toEqual( state[variable] );
            expect( configuration[new_variable] ).toEqual(['a','b','c','d']);
        });

    });

    describe('...table name', () => {

        it('should provide table name correctly', () => {

            let name = commons.getTableNameV1('xpto', 'item' ,'production', ['item', 'part'], ['production', 'development']);
            expect( name ).toEqual( 'xpto_item_production' );
        });

        it('should throw error on environment mismatch', () => {

            expect( commons.getTableNameV1.bind(commons, 'xpto', 'item' ,'production', ['item', 'part'], ['productionss', 'development']) )
                .toThrow( 'environment not enabled: production' );
        });

        it('should throw error on table mismatch', () => {

            expect( commons.getTableNameV1.bind(commons, 'xpto', 'item' ,'production', ['itemss', 'part'], ['production', 'development']) )
                .toThrow( 'table not enabled: item' );
        });

    });

    describe('...test variables handling', () => {

        it('should parse test variables correctly', () => {
            let variable = 'OBJECTS_TEST_property';
            let new_variable = 'OBJECTS_TEST';
            let state = {};
            state[variable] = 'xpto'

            let configuration = commons.handleTestVariables(variable, state);
            expect( configuration[variable] ).toEqual( state[variable] );
            expect( configuration[new_variable] ).toEqual( { property: 'xpto' } );
        });

        it('should parse test variables correctly', () => {
            let variable = 'STORELOADER_APP';
            let new_variable = 'STORELOADER_APP';
            let state = {};
            state[variable] = 'test'

            let configuration = commons.handleTestVariables(variable, state);
            expect( configuration[variable] ).toEqual( state[variable] );
            expect( configuration[new_variable] ).toEqual( 'test'  );
        });

        it('should parse env variables correctly', () => {
            process.env['avar'] = 'yes';

            let r = commons.getEnvironmentVarsSubset(['avar','anotherone'], process.env);

            expect( Object.keys(r).length ).toEqual( 1 );
            expect( r['avar'] ).toEqual( 'yes' );
        });


    });

});
