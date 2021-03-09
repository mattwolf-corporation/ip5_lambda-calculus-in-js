/*
idea shortcuts:
Shift-Alt I   : inspection window (errors, warning)
Cmd-Shift-I   : quick show implementation
Ctrl-J        : jsdoc quick lookup
Cmd-Hover     : quick info
Cmd-P         : parameter info
Ctrl-Shift-P  : expression type
*/

/**
 * Generic Types
 * @typedef {function} pair
 * @typedef {function} triple
 * @typedef {function} churchBoolean
 */

/**
 * x -> x ; Identity (id)
 * @lambda λx.x
 * @haskell Identity :: a -> a
 *
 * @function Identity
 * @param   {*} x
 * @returns {*} x
 */
const I = x => x;

/**
 * a -> b -> a ; Kestrel (Constant)
 * @lambda  λx.y.x
 * @haskell Kestrel :: a -> b -> a
 *
 * @function Konstant
 * @param    {*} x
 * @returns  { function(y:*): function(x:*) } a function that ignores its argument and returns x
 */
const K = x => y => x;

/**
 * x -> y -> y ; Kite
 * @lambda  λx.y.y
 * @haskell Kite :: a -> b -> b
 *
 * @function Kite
 * @param    {*} x
 * @returns  { function(y:*): function(y:*) } a function that returns its argument y
 */
const KI = x => y => y;

/**
 * f -> f( f ) ; Mockingbird
 * @lambda  λf.ff
 * @haskell Mockingbird :: f -> f
 *
 * @function Mockingbird
 * @param   {function} f
 * @returns { function({ f: { f } }) } a self-application combinator
 */
const M = f => f(f);

/**
 * f -> x -> y -> f( x )( y ) ; Cardinal (flip)
 * @lambda  λfxy.fxy
 * @haskell Cardinal :: f -> a -> b -> pair
 *
 * @function Cardinal
 * @function flip
 * @param    {function} f
 * @returns  { function(x:*): function(y:*): {f: { y x }} } The Cardinal, aka flip, takes two-argument function, and produces a function with reversed argument order.
 *
 * @example
 * C(K) (1)(2)  === 2
 * C(KI)(1)(21) === 1
 */
const C = f => x => y => f(y)(x);


/**
 * f -> g -> x -> f( g( x ) ) ; Bluebird (Function composition)
 *
 * @lambda λfgx.f(gx)
 * @haskell Bluebird :: f -> a -> b -> c
 *
 * @function Bluebird
 * @param   {function} f
 * @returns { function(g:function): function(x:*):  {f: { g:{x} } } } two-fold self-application composition
 *
 * @example
 * B(id)(id)(n7)     === n7
 * B(id)(jsnum)(n7)  === 7
 * B(not)(not)(True) === True
 */
const B = f => g => x => f(g(x));


/**
 * x -> f -> f( x ) ; Thrush (hold an argument)
 *
 * @lambda  λxf.fx
 * @haskell Thrush :: a -> f -> b
 *
 * @function Thrush
 * @param    {*} x
 * @returns  { function(f:function): {f: {x} } } self-application with holden argument
 */
const T = x => f => f(x);


/**
 * x -> y -> f -> f (x)(y) ; Vireo (hold pair of args)
 *
 * @lambda  λxyf.fxy
 * @haskell Vireo :: a -> b -> f
 *
 * @function Vireo
 * @param    {*} x
 * @returns  { function(y:*): function(f:function): {f: {x y} } }
 */
const V = x => y => f => f(x)(y);


/**
 * f -> g -> x -> y -> f( g(x)(y) ) ; Blackbird (Function composition with two args)
 *
 * @lambda  λfgxy.f(gxy)
 * @haskell Blackbird :: f -> g -> a -> b -> c
 *
 * @function
 * @param   {function} f
 * @returns { function(g:function): function(x:*): function(y:*): function({ f:{g: {x y}} }) }
 * @example
 * Blackbird(x => x)    (x => y => x + y)(2)(3) === 5
 * Blackbird(x => x * 2)(x => y => x + y)(2)(3) === 10
 */
const Blackbird = f => g => x => y => f(g(x)(y));

/**
 * x -> y -> y ; {churchBoolean} False Church-Boolean
 * @function
 * @type    churchBoolean
 * @return  KI
 */
const False = KI;

/**
 * x -> y -> x ; {churchBoolean} True Church-Boolean
 * @function
 * @type    churchBoolean
 * @return  K
 */
const True = K;


/**
 * Syntactic sugar for creating a If-Then-Else-Construct
 * Hint: Better use LazyIf to avoid that JavaScript eagerly evaluate both cases (then and else).
 *
 * @param condition
 * @return {function(truthy:churchBoolean): function(falsy:churchBoolean): *}
 * @constructor
 * @example
 * If( eq(n1)(n1) )
 *    (Then( "same"     ))
 *    (Else( "not same" ))
 */
const If = condition => truthy => falsy => condition(truthy)(falsy);

/**
 * Syntactic sugar for creating a If-Then-Else-Construct for lazy Evaluation - it avoid that JavaScript eagerly evaluate both cases (then and else)
 * Important: Use in 'Then' and 'Else' as function without param: () => "your function"
 *
 *
 * @param condition
 * @return {function(truthy:churchBoolean): function(falsy:churchBoolean): *}
 * @constructor
 * @example
 * LazyIf( eq(n1)(n1) )
 *      (Then( () => "same"     ))
 *      (Else( () => "not same" ))
 */
const LazyIf = condition => truthy => falsy => (condition(truthy)(falsy))();

/**
 * Syntactic sugar for If-Construct
 */
const Then = I;
const Else = I;

/**
 * f -> x -> y -> f( x )( y ) ; not ; Cardinal
 *
 * @function
 * @param   {churchBoolean} Church-Boolean
 * @returns {churchBoolean} negation of the insert Church-Boolean
 * @example
 * not(True)      === False;
 * not(False)     === True;
 * not(not(True)) === True;
 */
const not = C;

/**
 * p -> q -> p( q )(False) ; and
 *
 * @function
 * @param   {churchBoolean} p
 * @returns { function(q:churchBoolean): churchBoolean }  True or False
 */
const and = p => q => p(q)(False);

/**
 * p -> q -> p( True )(q) ; or
 *
 * @function
 * @param   {churchBoolean} p
 * @returns { function(q:churchBoolean): churchBoolean }  True or False
 */
const or = p => q => p(True)(q);

/**
 * p -> q -> p( q )( not(qn) ) ; beq (ChurchBoolean-Equality)
 *
 * @function
 * @param   {churchBoolean} p
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
 *
 * @function
 * @param   {churchBoolean} b
 * @return  {boolean} - true or false
 * @example
 * convertToJsBool(True)  === true;
 * convertToJsBool(False) === false;
 */
const convertToJsBool = b => b(true)(false);

/**
 * b => b ? True : False ; convertJsBoolToChurchBool
 *
 * @function
 * @param   {boolean} b
 * @return  {churchBoolean} - True or False
 * @example
 * convertJsBoolToChurchBool(true)  === True;
 * convertJsBoolToChurchBool(false) === False;
 */
const convertJsBoolToChurchBool = b => b ? True : False;

/**
 * x -> y -> f -> f(x)(y) ; Pair
 *
 * @function
 * @param {*} x:  firstOfPair argument of the pair
 * @returns { function(y:*): function(f:function): {f: {x y} } } - returns a function, that store two value
 */
const pair = V;

/**
 * Get first value of Pair
 *
 * @function
 * @return {function(x:*): function(y:*): x} - pair first stored value
 * @example
 * pair(n2)(n5)(fst) === n2
 */
const fst = K;

/**
 * Get second value of Pair
 *
 * @function
 * @return {function(x:*): function(y:*): y} - pair second stored value
 * @example
 * pair(n2)(n5)(snd) === n5
 */
const snd = KI;


/**
 *  x -> y -> z -> f -> f(x)(y)(z) ; Triple
 *
 * @function
 * @param {*} x - firstOfTriple argument of the Triple
 * @return { function(y:*):  function(z:*): function(f:function): {f: {x y z}} } - returns a function, that storage three arguments
 */
const triple = x => y => z => f => f(x)(y)(z);

/**
 * @haskell firstOfTriple :: a -> b -> c -> a
 *
 * x -> y -> z -> x ; firstOfTriple
 *
 * @function
 * @param {*} x
 * @return { function(y:*): function(z:*): x } - x
 * @example
 * triple(1)(2)(3)(firstOfTriple) === 1
 */
const firstOfTriple = x => y => z => x;

/**
 * x -> y -> z -> y ; secondOfTriple
 *
 * @function
 * @param {a} x
 * @return { function(y:*): function(z:*): y } - y
 * @example
 * triple(1)(2)(3)(firstOfTriple) === 2
 */
const secondOfTriple = x => y => z => y;

/**
 * x -> y -> z -> z ; thirdOfTriple
 *
 * @function
 * @param {*} x
 * @return { function(y:*): function(z:*): z } - z
 * @example
 * triple(1)(2)(3)(firstOfTriple) === 3
 */
const thirdOfTriple = x => y => z => z;

/**
 * function -> pair -> pair
 *
 * @function
 * @param {function} f
 * @return {function(pair): function(Function): {f: {x, y}}} new mapped pair
 * @example
 * mapPair( x => x+3 )( pair(1)(2) ) === pair(4)(5)
 * mapPair( x => x + "!!!" )( pair("Yes")("No") ) === pair("Yes!!!")("No!!!")
 */
const mapPair = f => p => pair(f(p(fst)))(f(p(snd)));

/**
 * p -> p `${p(fst)} | ${p(snd)} ; showPair
 *
 * @function
 * @param {pair} p
 * @return string with first and second value
 * @example
 * const testPair = pair('Erster')('Zweiter');
 * showPair(testPair) === 'Erster | Zweiter'
 */
const showPair = p => `${p(fst)} | ${p(snd)}`;

const id = x => x;

/**
 * Generic Types
 * @typedef {function} churchBoolean
 * @typedef {function} churchNumber
 */

/**
 *  church numbers 0 - 9
 *  n times application of function f to the argument a
 */
const n0 = f => a => a;
const n1 = f => a => f(a);
const n2 = f => a => f(f(a));
const n3 = f => a => f(f(f(a)));
const n4 = f => a => f(f(f(f(a))));
const n5 = f => a => f(f(f(f(f(a)))));
const n6 = f => a => f(f(f(f(f(f(a))))));
const n7 = f => a => f(f(f(f(f(f(f(a)))))));
const n8 = f => a => f(f(f(f(f(f(f(f(a))))))));
const n9 = f => a => f(f(f(f(f(f(f(f(f(a)))))))));

/**
 * successor of a church number (with bluebird)
 *
 * @lambda λnfa.f(nfa)
 * @haskell successor :: Number -> a -> b -> Number
 *
 * @function successor
 * @param   {churchNumber} n
 * @returns {function(f:function): churchNumber} successor of n
 */
const succ = n => f => B(f)(n(f));

/**
 * Addition with two Church-Numbers
 *
 * @lambda λnk.n( λnfa.f(nfa) )k
 * @haskell churchAddition :: Number -> Number -> Number
 *
 * @function
 * @param   {churchNumber} n
 * @returns {function(k:churchNumber): churchNumber } Church-Number
 */
const churchAddition = n => k => n(succ)(k);

/**
 * phi combinator
 * creates a new pair, replace first value with the second and increase the second value
 *
 * @function
 * @param   {pair} p
 * @returns {pair} pair
 */
const phi = p => pair(p(snd))(succ(p(snd)));

/**
 * predecessor
 * return the predecessor of passed churchNumber (minimum is n0 aka Zero). Is needed for churchSubtraction
 *
 * @function predecessor
 * @param   {churchNumber} n
 * @returns {churchNumber} predecessor of n
 */
const pred = n => n(phi)(pair(n0)(n0))(fst);

/**
 * Subtraction with two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchNumber } Church-Number
 */
const churchSubtraction = n => k => k(pred)(n);

/**
 * Multiplication with two Church-Numbers
 *
 * @function
 * @param   {churchNumber} n
 * @returns {function(k:churchNumber): churchNumber } Church-Number
 */
const churchMultiplication = B;

/**
 * Potency with two Church-Numbers
 *
 * @function
 * @param   {churchNumber} n
 * @returns {function(k:churchNumber): churchNumber } Church-Number
 */
const churchPotency = T;

/**
 * query if the church number is zero (n0)
 *
 * @function
 * @param  {churchNumber} n
 * @return {churchBoolean} True / False
 */
const is0 = n => n(K(False))(True);

/**
 * converts a js number to a church number
 *
 * @function
 * @param   {number} n
 * @returns {churchNumber} church number of n
 */
const toChurchNum = n => n === 0 ? n0 : succ(toChurchNum(n - 1))

/**
 * converts a church number to a js number
 *
 * @function
 * @param   {churchNumber} n
 * @returns {number} js number of n
 * @example
 * jsNum(n0) === 0
 * jsNum(n1) === 1
 * jsNum(n2) === 2
 * jsNum(n3) === 3
 */
const jsNum = n => n(x => x + 1)(0);


/**
 * "less-than-or-equal-to" with Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} True / False
 */
const leq = n => k => is0(churchSubtraction(n)(k));

/**
 * "equal-to" with Church-Number
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} True / False
 */
const eq = n => k => and(leq(n)(k))(leq(k)(n));

/**
 * "greater-than" with Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} True / False
 */
const gt = Blackbird(not)(leq);

/**
 * max of two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} n / k
 */
const max = n => k => gt(n)(k)(n)(k)

/**
 * min of two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} n / k
 */
const min = n => k => leq(n)(k)(n)(k)


/**
 * Generic Types
 * @typedef {*} a
 * @typedef {*} b
 * @typedef {function} pair
 * @typedef {function} churchBoolean
 * @typedef {function} churchNumber
 * @typedef {function} stack
 * @typedef {function} stackOp
 * @typedef {number} JsNumber
 * @typedef {function} maybe
 */

/**
 * index -> predecessor -> value -> f -> f(index)(predecessor)(head) ; Triple
 *
 * The stack is a pure functional data structure and is therefore immutable.
 * The stack is implemented as a triplet.
 * The first value of the triple represents the size (number of elements) of the stack.
 * At the same time the first value represents the index of the head (top value) of the stack.
 * The second value represents the predecessor stack
 * The third value represents the head ( top value ) of the stack
 *
 * @function
 * @type stack
 * @return {triple} stack as triple
 */
const stack = triple;

/**
 * Representation of the empty stack
 * The empty stack has the size/index zero (has zero elements).
 * The empty stack has no predecessor stack, but the identity function as placeholder.
 * The empty stack has no head ( top value ), but the identity function as placeholder.
 *
 * @function
 * @type stack
 * @return {stack} emptyStack
 */
const emptyStack = stack(n0)(id)(id);


/**
 * A help function to create a new stack
 * @function
 * @type function(Function): Stack
 * @param {function} f
 * @return {stack} emptyStack
 */
const startStack = f => f(emptyStack);

/**
 * stack getter function - get the Index (first of a triple)
 * @haskell stackIndex :: a -> b -> c -> a
 * @function stackIndex
 * @return {churchNumber} index/size
 * @example
 * stack(n0)(emptyStack)(42)(stackIndex) === n0
 */
const stackIndex = firstOfTriple;

/**
 * @haskell stackPredecessor :: a -> b -> c -> b
 *
 * stack getter function - get the Predecessor (second of a triple)
 *
 * @function stackPredecessor
 * @return {stack|id} predecessor stack or id if emptyStack
 * @example
 * stack(n0)(emptyStack)(42)(stackPredecessor) === emptyStack
 */
const stackPredecessor = secondOfTriple;


/**
 * stack getter function - get the Value (third of a triple)
 *
 * @haskell stackValue :: a -> b -> c -> c
 * @function stackValue
 * @return {*} value
 * @example
 * stack(n0)(emptyStack)(42)(stackValue) === 42
 */
const stackValue = thirdOfTriple;


/**
 * A function that takes a stack and returns a church-boolean, which indicates whether the stack has a predecessor stack
 * @haskell: hasPre :: a -> churchBoolean
 * @function hasPredecessor
 * @param {stack} s
 * @return {churchBoolean} churchBoolean
 */
const hasPre = s => not(is0(s(stackIndex)));

/**
 * A function that takes a stack and returns the predecessor stack
 * @haskell getPreStack :: stack -> stack
 * @function getPredecessorStack
 * @param {stack} s
 * @return {stack} predecessor of that stack
 */
const getPreStack = s => s(stackPredecessor)


/**
 *  A function that takes a stack and a value. The function returns a new stack with the pushed value
 * @haskell push :: stack -> a -> stack
 * @param {stack} s
 * @return {stack} stack with value a
 */
const push = s => stack(succ(s(stackIndex)))(s);

/**
 * A function that takes a stack. The function returns a value pair. The first element of the pair is the predecessor stack. The second element of the pair is the head (the top element) of the stack.
 * @haskell pop :: stack -> pair
 * @param {stack} s
 * @return {pair} pair
 */
const pop = s => pair(getPreStack(s))(head(s));

/**
 * A function that takes a stack. The function returns the head (the top value) of the stack.
 *
 * @haskell head :: stack -> a
 * @function
 * @param {stack} s
 * @return {*} stack-value
 */
const head = s => s(stackValue);

/**
 * A function that takes a stack. The function returns the index (aka stack-size) of the stack
 *
 * @haskell size :: stack -> churchNumber
 * @function
 * @param {stack} s
 * @return {churchNumber} stack-index as church numeral
 */
const getStackIndex = s => s(stackIndex);

/**
 * A function that takes a stack. The function returns the size (number of elements) in the stack
 *
 * @haskell size :: stack -> churchNumber
 * @function
 * @param {stack} s
 * @return {churchNumber} size (stack-index) as church numeral
 */
const size = getStackIndex;

/**
 * A function that takes argument pair and  a stack.
 * The first argument of the pair must be a reducer function.
 * The second argument of the pair must be a start value.
 * The function reduces the stack using the passed reduce function and the passed start value
 *
 * @haskell reduce :: pair -> stack -> a
 * @function
 * @param  {function} reduceFn
 * @return {function(initialValue:*): function(s:stack): function(stack)} reduced value
 * @example
 * const stackWithNumbers  = push(push(push(emptyStack)(0))(1))(2);
 *
 * const reduceFunctionSum = (acc, curr) => acc + curr;
 * reduce( reduceFunctionSum )( 0 )( stackWithNumbers )          ===  3
 * reduce( reduceFunctionSum )( 0 )( push(stackWithNumbers)(3) ) ===  5
 *
 * reduce( reduceFunctionSum )( 5 )( stackWithNumbers )          ===  8
 * reduce( reduceFunctionSum )( 5 )( push(stackWithNumbers)(3) ) === 10
 *
 * const reduceToArray = (acc, curr) => [...acc, curr];
 * reduce( reduceToArray )( [] )( stackWithNumbers ) === [0, 1, 2]
 */
const reduce = reduceFn => initialValue => s => {

    const reduceIteration = argsTriple => {
        const stack = argsTriple(firstOfTriple);

        const getTriple = argsTriple => {
            const reduceFunction = argsTriple(secondOfTriple);
            const preAcc = argsTriple(thirdOfTriple);
            const curr = head(stack);
            const acc = reduceFunction(preAcc, curr);
            const preStack = stack(stackPredecessor);
            return triple(preStack)(reduceFunction)(acc);
        }

        return If(hasPre(stack))
        (Then(getTriple(argsTriple)))
        (Else(argsTriple));
    };

    const times = size(s);
    const reversedStack = times(reduceIteration)(triple(s)((acc, curr) => push(acc)(curr))(emptyStack))(thirdOfTriple);
    const argsTriple = triple(reversedStack)(reduceFn)(initialValue);

    return (times(reduceIteration)(argsTriple))(thirdOfTriple);
};

/**
 * A function that takes a stack and an index (as Church- or JS-Number). The function returns the element at the passed index
 *
 * @haskell getElementByIndex :: stack -> number -> b
 * @throws Logs a error if index is no Church- or JS-Number and returns a undefined
 * @function
 * @param {stack} stack
 * @return {function(index:churchNumber|number) : * } stack-value or undefined not exist
 * @example
 * const stackWithNumbers = push(push(push(emptyStack)(0))(1))(2);
 *
 * getElementByIndex( stackWithNumbers )( n0 ) === id
 * getElementByIndex( stackWithNumbers )( n1 ) ===  0
 * getElementByIndex( stackWithNumbers )( n2 ) ===  1
 * getElementByIndex( stackWithNumbers )( n3 ) ===  2
 *
 * getElementByIndex( stackWithNumbers )( 0 ) === id
 * getElementByIndex( stackWithNumbers )( 1 ) ===  0
 * getElementByIndex( stackWithNumbers )( 2 ) ===  1
 * getElementByIndex( stackWithNumbers )( 3 ) ===  2
 *
 * getElementByIndex( stackWithNumbers )( "im a string" ) === undefined // strings not allowed, throws a Console-Warning
 */
const getElementByIndex = stack => index =>
    maybeElementByIndex(stack)(index)
    (console.error)
    (id);

/**
 * A function that takes a stack and an index (as Church- or JS-Number). The function returns a maybe with the value or Nothing if not exist or illegal index argument
 * @haskell maybeElementByIndex :: stack -> number -> maybe
 * @function
 * @param {stack} stack
 * @return {function(index:churchNumber|number) : maybe } a maybe with element or Nothing
 * @example
 * const stackWithNumbers = push(push(push(emptyStack)(0))(1))(2);
 *
 * maybeElementByIndex( stackWithNumbers )( n0 ) === Just(id)
 * maybeElementByIndex( stackWithNumbers )( n1 ) ===  Just(0)
 * maybeElementByIndex( stackWithNumbers )( n2 ) ===  Just(1)
 * maybeElementByIndex( stackWithNumbers )( n3 ) ===  Just(2)
 *
 * maybeElementByIndex( stackWithNumbers )( 0 ) === Just(id)
 * maybeElementByIndex( stackWithNumbers )( 1 ) ===  Just(0)
 * maybeElementByIndex( stackWithNumbers )( 2 ) ===  Just(1)
 * maybeElementByIndex( stackWithNumbers )( 3 ) ===  Just(2)
 *
 * getElementByIndex( stackWithNumbers )( "im a string" ) === Nothing // strings not allowed, throws a Console-Warning
 */
const maybeElementByIndex = stack => index =>
    eitherAnyOrError(
        () => eitherFunctionOrOther(stack) // stack value is NOT a stack aka function
            (_ => Left(`getElementByIndex - TypError: stack value '${stack}' (${typeof stack}) is not allowed. Use a Stack (type of function)`))
            (_ => eitherJsNumOrOther(index)
                (_ => maybeElementByChurchIndex(stack)(index))
                (_ => maybeElementByJsNumIndex(stack)(index))
            ))
    (_ => Left(`getElementByIndex - TypError: stack value '${stack}' (${typeof stack}) is not a stack.`)) // catch
        (id) // return value

const maybeElementByChurchIndex = stack => index => eitherFunctionOrOther(index)
(_ => Left(`getElementByIndex - TypError: index value '${index}' (${typeof index}) is not allowed. Use Js- or Church-Numbers`))
(_ => maybeElementWithCustomErrorMessage("invalid index")(getElementByChurchNumberIndex(stack)(index)));  // index is a Churmber

const maybeElementByJsNumIndex = stack => index => maybeElementWithCustomErrorMessage("invalid index")(getElementByJsnumIndex(stack)(index));

/**
 *  A function that takes a stack and an index as churchNumber. The function returns the element at the passed index
 *
 * @function
 * @param {stack} s
 * @return { function(i:churchNumber) : * } stack-value
 */
const getElementByChurchNumberIndex = s => i =>
    If(leq(i)(size(s)))
    (Then(head((churchSubtraction(size(s))(i))(getPreStack)(s))))
    (Else(undefined));


/**
 *  A function that takes a stack and an index as JsNumber. The function returns the element at the passed index
 *
 * @function
 * @param {stack} s
 * @return { function(i:Number) : * } stack-value
 */
const getElementByJsnumIndex = s => i => {
    const times = succ(size(s));
    const initArgsPair = pair(s)(undefined); // Nothing or undefined

    const getElement = argsPair => {
        const stack = argsPair(fst);
        const result = pair(getPreStack(stack));

        // was ist aufwändiger toJsnum oder toChurchNum ?? evtl. hier austauschen
        if (jsNum(getStackIndex(stack)) === i) {
            return result(head(stack));
        }
        return result(argsPair(snd));
    };
    return (times(getElement)(initArgsPair))(snd);
};


// gives the church index
const getIndexOfElement = s => element => {

    const getIndex = argsPair => {
        const stack = argsPair(fst);
        const result = pair(getPreStack(stack));

        return If(convertJsBoolToChurchBool(head(stack) === element))
        (Then(result(getStackIndex(stack))))
        (Else(result(argsPair(snd))));
    }

    const times = succ(size(s));
    const initArgsPair = pair(s)(False); // TODO: set value to undefined

    return (times
        (getIndex)(initArgsPair)
    )(snd);
}

const containsElement = s => element => not(is0(getIndexOfElement(s)(element)));

const convertStackToArray = reduce((acc, curr) => [...acc, curr])([]);

/**
 *  A function that takes an javascript array and converts the array into a stack. The function returns a stack
 *
 * @param  {Array} array
 * @return {stack} stack
 */
const convertArrayToStack = array => array.reduce((acc, curr) => push(acc)(curr), emptyStack);

/**
 *  A function that accepts a stack. The function returns the reversed stack.
 *
 * @param  {stack} s
 * @return {stack} stack (reversed)
 */
const reverseStack = s => (reduce((acc, curr) => pair(pop(acc(fst))(fst))(push(acc(snd))(pop(acc(fst))(snd))))(pair(s)(emptyStack))(s))(snd);

/**
 *  A function that accepts a map function and a stack. The function returns the mapped stack.
 *
 * @param  {function} mapFunc
 * @return {function(reduce:stack): function(stack)} stack
 */
const mapWithReduce = mapFunc => reduce((acc, curr) => push(acc)(mapFunc(curr)))(emptyStack);


const filterWithReduce = filterFunc => reduce((acc, curr) => filterFunc(curr) ? push(acc)(curr) : acc)(emptyStack);


const map = mapFunction => s => {
    const times = size(s);
    const initArgsPair = pair(emptyStack)(n0);

    const mapIteration = argsPair => {
        const index = argsPair(snd);

        if (convertToJsBool(eq(times)(index))) {
            return argsPair;
        }
        const increasedIndex = succ(argsPair(snd));
        const valueToMap = getElementByIndex(s)(increasedIndex);
        const mappedValue = mapFunction(valueToMap);
        const resultStack = push(argsPair(fst))(mappedValue);

        return pair(resultStack)(increasedIndex);
    };

    return (times(mapIteration)(initArgsPair))(fst);
};


const filter = filterFunction => s => {
    const times = size(s);
    const initArgsPair = pair(emptyStack)(n0);

    const filterIteration = argsPair => {
        const stack = argsPair(fst);
        const index = argsPair(snd);
        const increasedIndex = succ(index);

        if (convertToJsBool(not(eq(times)(index)))) {
            const value = getElementByChurchNumberIndex(s)(increasedIndex) //( console.error( new Error(`elementByIndex in Function Filter error ${typeof increasedIndex} -> ${increasedIndex}`)) )( id );

            if (filterFunction(value)) {
                const resultStack = push(stack)(value);
                return pair(resultStack)(increasedIndex);
            }
        }

        return pair(stack)(increasedIndex);
    };

    return (times(filterIteration)(initArgsPair))(fst);
};

const logStackToConsole = stack =>
    forEach(stack)((element, index) => console.log("At Index " + index + " is the Element " + JSON.stringify(element)))


const stackOpBuilder = stackOp => s => x => f => f(stackOp(s)(x));


const pushToStack = stackOpBuilder(push);

const forEach = stack => callbackFunc => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const invokeCallback = p => {
        const s = p(fst);
        const index = p(snd);
        const element = head(s);

        callbackFunc(element, index);

        return pair(getPreStack(s))(index + 1);
    }

    const iteration = p =>
        If(hasPre(p(fst)))
        (Then(invokeCallback(p)))
        (Else(p));

    times
    (iteration)(pair(reversedStack)(1));
};


const removeByIndex = stack => index => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const iteration = argsTriple => {
        const currentStack = argsTriple(firstOfTriple)
        const resultStack = argsTriple(secondOfTriple)
        const currentIndex = argsTriple(thirdOfTriple)

        return If(hasPre(currentStack))
        (Then(removeByCondition(currentStack)(resultStack)(index)(currentIndex)))
        (Else(argsTriple))
    }

    return (times
        (iteration)
        (triple
        (reversedStack)
        (emptyStack)
        (n1))
    )
    (secondOfTriple)
}


const removeByCondition = currentStack => resultStack => index => currentIndex => {
    const currentElement = head(currentStack);
    const indexNumber = typeof index === "number" ? toChurchNum(index) : index;
    const result = If(eq(indexNumber)(currentIndex))
    (Then(resultStack))
    (Else(push(resultStack)(currentElement)));

    return triple
    (getPreStack(currentStack))
    (result)
    (succ(currentIndex));
}


const concat = s1 => s2 =>
    s1 === emptyStack
        ? s2
        : s2 === emptyStack
        ? s1
        : reduce((acc, curr) => push(acc)(curr))(s1)(s2);


const flatten = reduce((acc, curr) => concat(acc)(curr))(emptyStack);


const zipWith = f => s1 => s2 => {
    const size1 = size(s1);
    const size2 = size(s2);

    const zipElements = t => {
        const s1 = t(firstOfTriple);
        const s2 = t(secondOfTriple);
        const acc = t(thirdOfTriple);

        const element1 = head(s1);
        const element2 = head(s2);

        const result = push(acc)(f(element1)(element2));

        return triple
        (getPreStack(s1))
        (getPreStack(s2))
        (result);
    }

    const iteration = t =>
        If(hasPre(t(firstOfTriple)))
        (Then(zipElements(t)))
        (Else(t));

    const times = min(size1)(size2);

    return times
    (iteration)
    (triple
        (reverseStack(s1))
        (reverseStack(s2))
        (emptyStack)
    )
    (thirdOfTriple);
}


const zip = zipWith(pair);


/**
 * Check two stacks of equality.
 *
 * @param {stack} s1
 * @return {function(s2:stack): churchBoolean} True / False
 *
 * @example
 * const s1 = convertArrayToStack([1, 2, 7]);
 * const s2 = convertArrayToStack([1, 2, 3]);
 *
 * stackEquals(s1)(s1) === True
 * stackEquals(s1)(s2) === False
 */
const stackEquals = s1 => s2 => {
    const size1 = size(s1);
    const size2 = size(s2);

    const times = size1;

    const compareElements = t => {
        const s1 = t(firstOfTriple);
        const s2 = t(secondOfTriple);

        const element1 = head(s1);
        const element2 = head(s2);

        const result = convertJsBoolToChurchBool(element1 === element2);

        return triple(getPreStack(s1))(getPreStack(s2))(result);
    }

    const iteration = t =>
        LazyIf(and(hasPre(t(firstOfTriple)))(t(thirdOfTriple)))
        (Then(() => compareElements(t)))
        (Else(() => t));

    return LazyIf(eq(size1)(size2))
    (Then(() => times(iteration)(triple(reverseStack(s1))(reverseStack(s2))(True))(thirdOfTriple))) // should only be executed when needed
        (Else(() => False))
}


const Left   = x => f => _ => f (x);
const Right  = x => _ => g => g (x);
const either = id;

const Nothing  = Left();
const Just     = Right ;


/**
 * unpacks the Maybe element if it is there, otherwise it returns the default value
 *
 * @param maybe
 * @return {function(defaultVal:function): *} maybe value or given default value
 * @example
 * getOrDefault( maybeDiv(6)(2) )( "Can't divide by zero" ) === 3
 * getOrDefault( maybeDiv(6)(0) )( "Can't divide by zero" ) === "Can't divide by zero"
 */
const getOrDefault = maybe => defaultVal =>
    maybe
    (() => defaultVal)
    (id);

/**
 *
 * @param  {number} dividend
 * @return {function(divisor:number): function(Just|Nothing)} a Maybe (Just with the divided value or Nothing)
 */
const maybeDivision = dividend => divisor =>
    Number.isInteger(dividend) &&
    Number.isInteger(divisor) &&
    divisor !== 0
        ? Just(dividend / divisor)
        : Nothing;

const eitherTruthy = value =>
    value
        ? Right(value)
        : Left(`'${value}' is a falsy value`);

const eitherNotNullAndUndefined = value =>
    value !== null && value !== undefined
        ? Right(value)
        : Left(`element is '${value}'`);

/**
 * Take the element as maybe value if the element is a truthy value inclusive number Zero
 * @param  {*} element
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeTruthy = element =>
    eitherTruthy(element)
    (_ => Nothing)
    (_ => Just(element));

const eitherElementOrCustomErrorMessage = errorMessage => element =>
    eitherTruthy(element)
    (_ => Left(errorMessage))
    (_ => Right(element));

/**
 *
 * @param  {string} elemId
 * @return {Left|Right} either Right with HTMLElement or Left with Error
 */
const eitherDomElement = elemId =>
    eitherElementOrCustomErrorMessage(`no element exist with id: ${elemId}`)(document.getElementById(elemId));


const maybeDomElement = elemId =>
    eitherDomElement(elemId)
    (_ => Nothing)
    (e => Just(e));

const eitherDomElementOrConsoleError = elemId =>
    eitherDomElement(elemId)(console.error);

/**
 *
 * @param  {string} elemId
 * @return {HTMLElement|undefined} HTMLElement when exist, else undefined
 */
const getDomElement = elemId =>
    eitherDomElementOrConsoleError(elemId)(id);

const getDomElements = (...elemIds) =>
    elemIds.map(getDomElement);

const maybeNumber = val =>
    eitherNumber(val)
    (_ => Nothing)
    (_ => Just(val));

const eitherNumber = val =>
    Number.isInteger(val)
        ? Right(val)
        : Left(`'${val}' is not a integer`);

const maybeFunction = val =>
    eitherFunction(val)
    (_ => Nothing)
    (_ => Just(val))

const eitherFunction = val =>
    typeof val === "function"
        ? Right(val)
        : Left(`'${val}' is not a function`);

const eitherTryCatch = f => {
    try {
        return Right(f());
    } catch (error) {
        return Left(error);
    }
}

const eitherNaturalNumber = val =>
    Number.isInteger(val) && val >= 0
        ? Right(val)
        : Left(`'${val}' is not a natural number`);

// Haskell: (a -> Maybe a) -> [a] -> Maybe [a]
const maybeElementsByFunction = maybeProducerFn => (...elements) =>
    reduce
    ((acc, curr) =>
        flatMapMaybe(acc)(listMap =>
            mapMaybe( maybeProducerFn(curr) )(val => push(listMap)( pair(curr)(val) ))
        )
    )
    ( Just(emptyListMap) )
    ( convertArrayToStack(elements) );


// Beispiel: key => maybeFunc(key) ||  [Just(elem1), Just(Elem2), Nothing, Just(Elem3)] => Just([elem1, elem2, Elem3])
const eitherElementsOrErrorsByFunction = eitherProducerFn => (...elements) =>
    reduce
    ((acc, curr) => acc
        ( stack => Left( (eitherProducerFn(curr))
            (err => push(stack)(err))
            (_   => stack)
            )
        )
        ( listMap => (eitherProducerFn(curr))
            (err => Left(  push(emptyStack)(err) ) )
            (val => Right( push(listMap)( pair(curr)(val) ) ) )
        )
    )
    ( Right(emptyListMap) )
    ( convertArrayToStack(elements) );




const listMap = stack

/**
 * Representation of the empty stack
 * The empty listMap has the size/index zero (has zero elements).
 * The empty listMap has no predecessor stack, but the identity function as placeholder.
 * The empty listMap has no head ( top value ), but a pair of two identity functions as placeholder.
 *
 * @type {function(Function): {f: {index, predecessor, head}}}
 */
const emptyListMap = listMap(n0)(id)(pair(id)(id));


const startListMap = f => f(emptyListMap);


const convertObjToListMap = obj => Object.entries(obj).reduce((acc, [key, value]) => push(acc)(pair(key)(value)), emptyListMap);


const getElementByKey = listMap => key => {
    const times = size(listMap);
    const initArgsPair = pair(listMap)(id);

    const getElement = argsPair => {
        const stack = argsPair(fst);
        const predecessorStack = (stack)(stackPredecessor);
        const currentKeyValPair = head(stack);
        if (currentKeyValPair(fst) === key) {
            return pair(predecessorStack)(currentKeyValPair(snd));
        }
        return pair(predecessorStack)(argsPair(snd));
    };

    return (times(getElement)(initArgsPair))(snd);
};


const removeByKey = listMap => key => {
    const times = size(listMap);
    const reversedStack = reverseStack(listMap);

    const iteration = argsPair => {
        const currentStack = argsPair(fst)
        const resultStack = argsPair(snd)

        return If(hasPre(currentStack))
        (Then(removeByCon(currentStack)(resultStack)(key)))
        (Else(argsPair));
    }

    return (times
        (iteration)
        (pair(reversedStack)(emptyListMap))
    )(snd);
}


const removeByCon = currentStack => resultStack => key => {
    const currentKeyValPair = head(currentStack);
    const currentElement = currentKeyValPair(snd);
    const currentKey = currentKeyValPair(fst);
    const result = key === currentKey
        ? resultStack
        : push(resultStack)(pair(currentKey)(currentElement));

    return pair(getPreStack(currentStack))(result);
}

const mapListMap = f => map(p => pair(p(fst))(f(p(snd))));

const filterListMap = f => filter(p => f(p(snd)));

const reduceListMap = f => reduce((acc, curr) => f(acc, curr(snd)));

const InitObservable = initialValue => Observable(emptyListMap)(initialValue)(setValue)(initialValue)


const Observable = listeners => value => obsFn =>
    obsFn(listeners)(value)


const setValue = listeners => oldValue => newValue => {
    forEach(listeners)((listener, _) => (listener(snd))(newValue)(oldValue))
    return Observable(listeners)(newValue)
}

const addListener = listeners => value => newListener => {
    newListener(snd)(value)(value)
    return Observable(push(listeners)(newListener))(value)
}


const getValue = listeners => value => value


const removeListenerByKey = listeners => value => listenerKey =>
    Observable(removeByKey(listeners)(listenerKey))(value)


const removeListenerByHandler = listeners => value => handler =>
    Observable(removeByKey(listeners)(handler(fst)))(value)

// Observable Tools
const logListenersToConsole = listeners => _ => {
    const logIteration = (acc, curr) => {
        const index = acc + 1;
        const val = typeof (curr) === 'object' ? JSON.stringify(curr) : curr;
        console.log('element at: ' + index + ': ' + showPair(val));
        return index;
    };
    reduce(logIteration)(0)(listeners);
};


// Observable Handler-Utilities
const handlerBuilder = key => handlerFn => pair(key)(handlerFn)

const handlerFnLogToConsole = nVal => oVal => console.log(`Value: new = ${nVal}, old = ${oVal}`)
const buildHandlerFnTextContent = element => nVal => oVal => element.textContent = nVal
const buildHandlerFnTextContentOldValue = element => nVal => oVal => element.textContent = oVal
const buildHandlerFnTextContentLength = element => nVal => oVal => element.textContent = nVal.length
const buildHandlerFnValue = element => nVal => oVal => element.value = nVal


// Box === Monade
const Box = x => mapf(x)(id);                     // Box.of
const mapf = x => f => g => g(f(x));               // Box.map
const fold = x => f => f(x);   // T         // map and then get content out of the box
const chain = x => f => g => g((f(x)(id)));         // Box.flatMap
const apply = x => f => g => g(f(mapf)(x)(id));     // Box Applicative
const getContent = b => b(id)                       // get Content out of the box (unwrap)

const liftA2 = f => fx => fy =>
    fx(mapf)(f)(apply)(fy)

const debug = x => {
    console.log(x);
    return x;
}


// maybe box methods
const mapMaybe = maybe => f => maybe(() => maybe)(x => Just(f(x)));  // maybe.map
const flatMapMaybe = maybe => f => maybe(() => maybe)(x => f(x));  // maybe.flatmap

const mapfMaybe = x => f => g => g(mapMaybe(x)(f));                     // map (returns a box) --> for chaining
const foldMaybe = mapMaybe;                                             // map and then get Content out of the box
const chainMaybe = x => f => g => g(flatMapMaybe(x)(f));                 // map ant then flatten (returns a box) --> for chaining
// const apMaybe    = x => f => g => g(x(() => x)(func => mapMaybe(f)(func)));
const apMaybe = x => f => g => g(flatMapMaybe(x)(func => mapMaybe(f)(func)));

const liftA2Maybe = f => fx => fy =>
    Box(fx)
    (mapfMaybe)(f)
    (apMaybe)(fy)

// should be the only try and catch in code basis !
const tryCatch = f => {
    try {
        return Right(f());
    } catch (error) {
        return Left(error);
    }
}


const DataFlowVariable = howto => {
    let value = undefined;
    return () => {
        if (value !== undefined) {
            return value
        }
        value = howto();
        return value;
    }
};

const jokeUrl = "https://api.chucknorris.io/jokes/random";

const HttpGet = url => callback => {
    const xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = () =>
        (xmlHttp.readyState > 1 && xmlHttp.readyState < 4)
            ? (xmlHttp.status < 200 || xmlHttp.status >= 300) ? xmlHttp.abort() : () => console.log("not readystate: " + xmlHttp.readyState)
            : (xmlHttp.readyState === 4 && xmlHttp.status >= 200 && xmlHttp.status < 300) ? callback(xmlHttp.responseText) : () => console.error("error fetch data")


    xmlHttp.open("GET", url, true);
    xmlHttp.timeout = 10 * 1000;                     //10 seconds
    xmlHttp.ontimeout = () => console.error("timeout");
    xmlHttp.send();
}

// const HttpGet = url => callback => {
//     const xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = () =>
//         (xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status === 200)
//             ? callback(xmlHttp.response)
//             : new Error("god damnit")
//     xmlHttp.open("GET", url, true); // true for asynchronous
//     xmlHttp.send();
// }


const HttpGetAsync = url => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send();
    return xmlHttp;
}

// const xhr = DataFlowVariable(async () => await HttpGetAsync(jokeUrl))()
// xhr.then(x => x.response)


const HttpGetSync = url => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send();
    return xmlHttp.response;
}
