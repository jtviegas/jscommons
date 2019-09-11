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


});
