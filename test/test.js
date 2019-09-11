'use strict';

const commons = require('../index').commons;
const chai = require('chai');
const expect = chai.expect;

describe('index tests', function() {

    describe('...configuration', function(done) {

        it('should parse list variables correctly', function(done) {
            let variable = 'OBJECTS_LIST';
            let new_variable = 'OBJECTS';
            let state = {};
            state[variable] = 'a,b,c,d'

            let configuration = commons.handleListVariables(variable, state);
            expect( configuration[variable] ).to.equal( state[variable] );
            expect( configuration[new_variable] ).to.deep.equal(['a','b','c','d']);
            done(null);
        });

    });

    describe('...table name', function(done) {

        it('should provide table name correctly', function(done) {

            let name = commons.getTableNameV1('xpto', 'item' ,'production', ['item', 'part'], ['production', 'development']);
            expect( name ).to.equal( 'xpto_item_production' );

            done(null);
        });

        it('should throw error on environment mismatch', function(done) {

            expect( commons.getTableNameV1.bind(commons, 'xpto', 'item' ,'production', ['item', 'part'], ['productionss', 'development']) )
                .to.throw( 'environment not enabled: production' );

            done(null);
        });

        it('should throw error on table mismatch', function(done) {

            expect( commons.getTableNameV1.bind(commons, 'xpto', 'item' ,'production', ['itemss', 'part'], ['production', 'development']) )
                .to.throw( 'table not enabled: item' );

            done(null);
        });

    });

});
