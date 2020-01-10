import {TestSuite} from "../test.js";

import {
    id,
    K,
    KI,
    M,
    C,
    B,
    T,
    V,
    Blackbird,
    fst,
    beq,
    snd,
    and,
    or,
    not,
    True,
    False,
    pair,
    triple,
    showPair,
    mapPair,
    convertToJsBool,
    showBoolean,
    firstOfTriple,
    secondOfTriple,
    thirdOfTriple
} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {n1, n2, n3, n4, n5, n6, n7, n8, n9, jsnum} from "../../src/lambda-calculus-library/church-numerals.js";

const lambdaCTest = TestSuite("Lambda Calculus");

lambdaCTest.add("identity", assert => {
    assert.equals(id(1), 1);
    assert.equals(id(n1), n1);
    assert.equals(id(true), true);
    assert.equals(id(id), id);
    assert.equals(id === id, true);
});

lambdaCTest.add("kestrel", assert => {
    assert.equals(K(1)(2), 1);
    assert.equals(K(n1)(n2), n1);
    assert.equals(K(id)(KI), id);
    assert.equals(K(K)(id), K);
    assert.equals(K(K)(id)(1)(2), 1);
});

lambdaCTest.add("kite", assert => {
    assert.equals(KI(1)(2), 2);
    assert.equals(KI(n1)(n2), n2);
    assert.equals(KI(id)(KI), KI);
    assert.equals(KI(KI)(id), id);
    assert.equals(KI(id)(KI)(1)(2), 2);
});

lambdaCTest.add("mockingbird", assert => {
    assert.equals(M(id), id);
    assert.equals(M(id)(5), 5);
    assert.equals(M(K)(5), K);
    assert.equals(M(KI)(5), 5);
    assert.equals(M(id)(KI)(2)(7), 7);
});

lambdaCTest.add("cardinal", assert => {
    assert.equals(C(fst)(1)(2), 2);
    assert.equals(C(snd)(1)(2), 1);
    assert.equals((C(snd)(id)(7))(6), 6);
    assert.equals((C(snd)(id)(7))(id), id);
    assert.equals(C(fst)(id)(7), 7);
});

lambdaCTest.add("bluebird", assert => {
    const f = x => x + 1;
    const g = x => x * 2;

    assert.equals(B(f)(g)(4), 9);
    assert.equals(B(g)(f)(4), 10);
    assert.equals(B(id)(id)(5), 5);
    assert.equals(B(f)(id)(5), 6);
    assert.equals(B(id)(g)(5), 10);
});

lambdaCTest.add("thrush", assert => {
    const f = x => x + 1;

    assert.equals(T(2)(f), 3);
    assert.equals(T(2)(id), 2);
    assert.equals(T(id)(id), id);
    assert.equals(jsnum(T(n2)(n3)), 8);
    assert.equals(jsnum(T(n3)(n2)), 9);
});

lambdaCTest.add("vireo", assert => {
    // TODO:
});

lambdaCTest.add("blackbird", assert => {
    // TODO:
});

lambdaCTest.add("convert to js-bool", assert => {
    assert.equals(convertToJsBool(True), true);
    assert.equals(convertToJsBool(False), false);
});

lambdaCTest.add("show boolean", assert => {
    assert.equals(showBoolean(True), 'True');
    assert.equals(showBoolean(False), 'False');
});

lambdaCTest.add("boolean and", assert => {
    assert.equals(and(True)(True), True);
    assert.equals(and(False)(True), False);
    assert.equals(and(True)(False), False);
    assert.equals(and(False)(False), False);

    assert.equals(or(and(False)(False))(True), True);
    assert.equals(and(or(True)(False))(True), True);
});

lambdaCTest.add("boolean or", assert => {
    assert.equals(or(True)(True), True);
    assert.equals(or(False)(True), True);
    assert.equals(or(True)(False), True);
    assert.equals(or(False)(False), False);
});

lambdaCTest.add("boolean not", assert => {
    assert.equals(convertToJsBool(not(True)), false);
    assert.equals(convertToJsBool(not(False)), true);
    assert.equals(convertToJsBool(not(not(False))), false);
    assert.equals(convertToJsBool(not(not(True))), true);
    assert.equals(convertToJsBool(not(and(True)(or(False)(True)))), false);
});

lambdaCTest.add("boolean equality", assert => {
    assert.equals(convertToJsBool(beq(True)(True)), true);
    assert.equals(convertToJsBool(beq(False)(False)), true);
    assert.equals(convertToJsBool(beq(True)(False)), false);
    assert.equals(convertToJsBool(beq(False)(True)), false);
});

lambdaCTest.add("show pair", assert => {
    const p1 = pair(2)(3);
    const p2 = pair("Hello")("World");
    const p3 = pair(x => x)(x => y => x);

    assert.equals(showPair(p1), '2 | 3');
    assert.equals(showPair(p2), 'Hello | World');
    assert.equals(showPair(p3), 'x => x | x => y => x');
});

lambdaCTest.add("map pair", assert => {
    const p1 = pair(2)(3);
    const p2 = pair("Hello")("World");

    const f = x => x * 4;
    const g = x => x + '!';

    assert.equals(showPair(mapPair(f)(p1)), '8 | 12');
    assert.equals(showPair(mapPair(g)(p2)), 'Hello! | World!');
});

lambdaCTest.add("triple", assert => {
    // TODO:
});

lambdaCTest.add("first of triple", assert => {
    const testArray = [1, 2];
    const testObject = {name: "test"};

    assert.equals(firstOfTriple(0)(1)(2), 0);
    assert.equals(firstOfTriple(2)(1)(0), 2);
    assert.equals(firstOfTriple(id)(1)(2), id);
    assert.equals(firstOfTriple(id(testObject))(1)(2), testObject);
    assert.equals(firstOfTriple(testArray)(1)(2), testArray);
});

lambdaCTest.add("second of triple", assert => {
    const testArray = [1, 2];
    const testObject = {name: "test"};

    assert.equals(secondOfTriple(0)(1)(2), 1);
    assert.equals(secondOfTriple(2)(1)(0), 1);
    assert.equals(secondOfTriple(5)(id)(4), id);
    assert.equals(secondOfTriple(2)(id(testArray))(1), testArray);
    assert.equals(secondOfTriple(2)(testObject)(1), testObject);
});

lambdaCTest.add("third of triple", assert => {
    const testArray = [1, 2];
    const testObject = {name: "test"};

    assert.equals(thirdOfTriple(0)(1)(2), 2);
    assert.equals(thirdOfTriple(2)(1)(0), 0);
    assert.equals(thirdOfTriple(5)(4)(id), id);
    assert.equals(thirdOfTriple(2)(1)(id(testObject)), testObject);
    assert.equals(thirdOfTriple(2)({name: "test"})(testArray), testArray);
});

lambdaCTest.report();
