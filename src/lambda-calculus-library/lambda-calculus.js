export {
    I as id,
    M,
    K,
    KI,
    C,
    B,
    T,
    V,
    Blackbird,
    fst,
    snd,
    firstOfTriple,
    secondOfTriple,
    thirdOfTriple,
    True,
    False,
    If,
    Then,
    Else,
    not,
    and,
    or,
    beq,
    showBoolean,
    convertToJsBool,
    pair,
    triple,
    mapPair,
    showPair,
    convertJsBoolToChurchBool
}

/**
 * Generic Types
 * @typedef {*} a
 * @typedef {*} b
 * @typedef {*} c
 * @typedef {(a|b|c)} abc
 * @typedef {*} p
 * @typedef {*} q
 * @typedef {*} x
 * @typedef {*} *
 * @typedef {*} y
 * @typedef {function} pair
 * @typedef {function} churchBoolean
 */

/**
 * x -> x ; Identity (id)
 * @function Identity
 * @param   {*} x
 * @returns {*} the Identity x
 */
const I = x => x;

/**
 * a -> b -> a ; Kestrel (Constant)
 * @function Konstant
 * @param  {*} x
 * @returns { function(y:*): function(x:*) } a function that ignores its argument and returns x
 */
const K = x => y => x;

/**
 * x -> y -> y ; Kite
 * @function Kite
 * @param {*} x
 * @returns { function(y:*): function(y:*) } a function that returns its argument y
 */
const KI = x => y => y;

/**
 * f -> f( f ) ; Mockingbird
 * @function Mockingbird
 * @param {fn} f
 * @returns { function({ f:  function({ f }) }) } a self-application combinator
 */
const M = f => f(f);

/**
 * f -> x -> y -> f( x )( y ) ; Cardinal (flip)
 * @function Cardinal
 * @param  {function} f
 * @returns { function(x:*): function(y:*): function(f:fn   function({ y x }) ) } The Cardinal, aka flip, takes two-argument function, and produces a function with reversed argument order.
 */
const C = f => x => y => f(y)(x);

/**
 * f -> g -> x -> f( g( x ) ) ; Bluebird (Function composition)
 * @function Bluebird
 * @param {function} f
 * @returns { function(g:function): function(x:*):  function({ f:  function({ g:x }) }) } two-fold self-application composition
 *
 * @example
 * B(id)(id)(n7) === n7
 * B(id)(jsnum)(n7) === 7
 * B(not)(not)(True) == True
 */
const B = f => g => x => f(g(x));

/**
 * x -> f -> f( x ) ; Thrush (hold an argument)
 * @function Thrush
 * @param {*} x
 * @returns { function(f:function): function(f x ) } self-application with holden argument
 */
const T = x => f => f(x);


/**
 * x -> y -> f -> f(x)(y) ; Vireo (hold pair of args)
 * @function Viral
 * @param {*} x
 * @returns { function(y:*): function(f:function): function(fn x y ) }
 */
const V = x => y => f => f(x)(y);

/**
 * f -> g -> x -> y -> f( g(x)(y) ) ; Blackbird (Function composition with two args)
 * @function
 * @param {function} f
 * @returns { function(g:function): function(x:*): function(y:*): function({ f:{g: {x y}} }) }
 * @example
 * Blackbird(x => x)(x => y => x + y)(2)(3)     === 5
 * Blackbird(x => x * 2)(x => y => x + y)(2)(3) === 10
 */
const Blackbird = f => g => x => y => f( g(x)(y) );

/**
 * x -> y -> y ; {churchBoolean} False Church-Boolean
 * @function
 * @return KI
 */
const False = KI;

/**
 * x -> y -> x ; {churchBoolean} True Church-Boolean
 * @function
 * @return K
 */
const True = K;


/**
 * TODO: Doc IF
 */
const If = condition => truthy => falshy => condition(truthy)(falshy)

/**
 * Syntactic sugar for If-Construct
 */
const Then = I;
const Else = I;

/**
 * f -> x -> y -> f( x )( y ) ; not
 * @function
 * @param {churchBoolean} Church-Boolean
 * @returns {churchBoolean} negation of the insert Church-Boolean
 * @example
 * not(True)      === False;
 * not(False)     === True;
 * not(not(True)) === True;
 * @return Cestral
 */
const not = C;

/**
 * p -> q -> p( q )(False) ; and
 * @function
 * @param {churchBoolean} p
 * @returns { function(q:churchBoolean): churchBoolean }  True or False
 */
const and = p => q => p(q)(False);

/**
 * p -> q -> p( True )(q) ; or
 * @function
 * @param {churchBoolean} p
 * @returns { function(q:churchBoolean): churchBoolean }  True or False
 */
const or = p => q => p(True)(q);

/**
 * p -> q -> p( q )( not(qn) ) ; beq (ChurchBoolean-Equality)
 * @function
 * @param {churchBoolean} p
 * @returns { function( q:churchBoolean): churchBoolean }  True or False
 * @example
 * beq(True)(True)   === True;
 * beq(True)(False)  === False;
 * beq(False)(False) === False;
 */
const beq = p => q => p(q)(not(q));

/**
 * b -> b("True")("False") ; showBoolean
 * @function
 * @param b {churchBoolean}
 * @return {string} - "True" or "False"
 * @example
 * showBoolean(True)  === "True";
 * showBoolean(False) === "False";
 */
const showBoolean = b => b("True")("False");

/**
 * b -> b(true)(false) ; convertToJsBool
 * @function
 * @param b {churchBoolean}
 * @return {boolean} - true or false
 * @example
 * convertToJsBool(True)  === true;
 * convertToJsBool(False) === false;
 */
const convertToJsBool = b => b(true)(false);

const convertJsBoolToChurchBool = b => b ? True : False;

/**
 * x -> y -> f -> f(x)(y) ; Pair
 * @function pair
 * @type {V.props|*}
 * @param {*} x:  firstOfPair argument of the pair
 * @returns { function(y:*): function(f:function): function(fn x y ) } - returns a function, that store two value
 */
const pair = V;

/**
 * fst ; Get first value of Pair
 * @function fst
 * @type {K.props|*}
 * @return pair first stored value
 * @example
 * pair(n2)(n5)(fst) === n2
 */
const fst = K;

/**
 * snd ; Get second value of Pair
 * @function snd
 * @type {KI.props|*}
 * @return pair second stored value
 * @example
 * pair(n2)(n5)(snd) === n5
 */
const snd = KI;

/**
 *  x -> y -> z -> f -> f(x)(y)(z) ; Triple
 * @function
 * @param {*} x - firstOfTriple argument of the Triple
 * @returns { function(y:*):  function(z:*): function(f:Function): function({x y z}) } - returns a function, that storage three arguments
 */
const triple = x => y => z => f => f(x)(y)(z);


/**
 * x -> y -> z -> x ; firstOfTriple
 * @function
 * @param {*} x
 * @return { function(y:*): function(z:*): x } x
 */
const firstOfTriple = x => y => z => x;

/**
 * x -> y -> z -> y ; secondOfTriple
 * @function
 * @param {a} x
 * @return { function(y:*): function(z:*): y } y
 */
const secondOfTriple = x => y => z => y;

/**
 * x -> y -> z -> i ; thirdOfTriple
 * @function
 * @param {*} x
 * @return { function(y:*): function(z:*): z }  z
 */
const thirdOfTriple = x => y => z => z;

/**
 * mapPair
 * @function
 * @param {function} f
 * @return {function(p:pair): pair} new mapped pair
 */
const mapPair = f => p => pair(f(p(fst)))(f(p(snd)));

/**
 * p -> p `${p(fst)} | ${p(snd)} ; showPair
 * @function
 * @param {pair} p
 * @return string with first and second value
 * @example
 * const testPair = pair('Erster')('Zweiter');
 * showPair(testPair) === 'Erster | Zweiter'
 */
const showPair = p => `${p(fst)} | ${p(snd)}`;
