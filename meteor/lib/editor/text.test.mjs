import test from "node:test";
import assert from "node:assert/strict";
import {
    containsValidSecret,
    getCommandsFromCode,
    extractSecrets
} from "./text.mjs"

function assertSameMembers(arr1, arr2) {
        const set1 = new Set(arr1);
        const set2 = new Set(arr2);
        assert.deepStrictEqual(set1, set2);
}

/**
 * Default meteor tests for programming principles to be forced
 */
test("editor text util functions", function() {
    test("identifies invalid secrets", function() {
        assert.strictEqual(containsValidSecret("/*\n//SECRET\n*/\nsig a {}"),false)
        assert.strictEqual(containsValidSecret("something"),false)
        assert.strictEqual(containsValidSecret("something/SECRET"),false)
        assert.strictEqual(containsValidSecret("something//SECRET\n"),false)
        assert.strictEqual(containsValidSecret("something\n//SECRET\nthis is the secret"),false)
        assert.strictEqual(containsValidSecret("\n//SECRET\nthis is the secret"),false)
    });
    test("identifies valid secrets", function() {
        assert.strictEqual(containsValidSecret(" //SECRET\nsig a {}"),true)
        assert.strictEqual(containsValidSecret("//SECRET\nsig a {}"),true)
        assert.strictEqual(containsValidSecret("//SECRET  \nsig a {}"),true)
        assert.strictEqual(containsValidSecret("sig a {} //SECRET\nsig b {}"),true)
    });
    test("identifies correct commands in code", function() {
        let code = `
// run shouldNotDetect { no d: Dir | d in d.^contents }
// check shouldNotDetect2 { no d: Dir | d in d.^contents }
run run1 for 5
run run2
run run3 {}
check check1 for 5
check check2
`
        assertSameMembers(getCommandsFromCode(code), ["run run1", "run run2", "run run3", "check check1", "check check2"])

        code = `
-- run shouldNotDetect { no d: Dir | d in d.^contents }
-- check shouldNotDetect2 { no d: Dir | d in d.^contents }
run run1 for 5 // comment
run run2
run run3 {}
check check1 for 5
check check2
`
        assertSameMembers(getCommandsFromCode(code), ["run run1", "run run2", "run run3", "check check1", "check check2"])


        code = `
// run shouldNotDetect { no d: Dir | d in d.^contents }
// check shouldNotDetect2 { no d: Dir | d in d.^contents }
/*run run1 for 5*/
check check2
`
        assertSameMembers(getCommandsFromCode(code), ["check check2"])

        code = `
// run shouldNotDetect { no d: Dir | d in d.^contents }
// check shouldNotDetect2 { no d: Dir | d in d.^contents }
/*run run1 for 5
run run2
run run3 {}
check check1 for 5*/
check check2
`
        assertSameMembers(getCommandsFromCode(code), ["check check2"])

        code = `
//SECRET 
pred a {}
run run1 for 5
//SECRET 
pred b {}
`
        assertSameMembers(getCommandsFromCode(code), ["run run1"])

        code = `
/* Every person is a student. */
pred inv1 {

}

run run1 {}

/* There are no teachers. */
pred inv2 {

}
`
        assertSameMembers(getCommandsFromCode(code), ["run run1"])


    });
});

test("extracting secrets method", function() {
    let code, res
    test("returns empty public and secret", function() {
        code = ``
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, "")
    });
    test("returns empty secret and correct public", function() {
        code = `sig A {}`
        res = extractSecrets(code)
        assert.equal(res.secret, "")
        assert.equal(res.public, code)

        code = 
`sig A {}
pred checkStuff{

}`
        res = extractSecrets(code)
        assert.equal(res.public, code)
        assert.equal(res.secret, "")

        code = 
`/* //SECRET */
sig A {}
pred checkStuff{

}`
        res = extractSecrets(code)
        assert.equal(res.public, code)
        assert.equal(res.secret, "")

        code = 
`//SECRETs
abstract sig A {}
pred checkStuff{

}`
        res = extractSecrets(code)
        assert.equal(res.public, code)
        assert.equal(res.secret, "")
   
        code = 
`//SECRET sig A {}`
        res = extractSecrets(code)
        assert.equal(res.public, code)
        assert.equal(res.secret, "")
  
        code = 
`//SECRET
`
        res = extractSecrets(code)
        assert.equal(res.public, code)
        assert.equal(res.secret, "")

        code = 
`sig A{} //SECRET sig B {}`
        res = extractSecrets(code)
        assert.equal(res.public, code)
        assert.equal(res.secret, "")

    });    


    test("returns empty public and correct secret", function() {
        code = 
`//SECRET
sig A {}`
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, code)

        code = 
`//SECRET
sig A {}
//SECRET
pred checkStuff{

}`
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, code)

        code = 
`//SECRET
abstract lone sig A {} //SECRET
pred checkStuff{

}`
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, code)

        code = 
`//SECRET
sig A {} //SECRET 
pred checkStuff{
    //SECRET
}`
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, code)

        code = 
`    //SECRET      
sig A {}     //SECRET 
pred checkStuff{}`
        res = extractSecrets(code)
        assert.equal(res.public, "    ")
        assert.equal(res.secret, code.substr(4))

        code = 
`//SECRET
lone sig A {} //SECRET
pred checkStuff{

}`
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, code)

        code = 
`//SECRET
/* sig a {} */
lone sig b {}`
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, code)

        code = 
`//SECRET  
  /* sig a {} */
lone sig b {}`
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, code)

        code = 
`//SECRET  
  // sig a {} 
lone sig b {}`
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, code)

        code = 
`//SECRET  
/* //SECRET */   
   lone sig b {}`
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, code)

        code = 
`//SECRET  
-- //SECRET
   lone sig b {}`
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, code)

        code = 
`//SECRET  
/* //SECRET */     lone sig b {}`
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, code)

        code = 
`//SECRET
//SECRET
one sig a {}`
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, code)

        code = 
`//SECRET
/* sig a {} */
/* sig a {} */
lone sig b {}`
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, code)

        code = 
`//SECRET
// sig a {}
/* sig a {} */
lone sig b {}`
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, code)       

        code = 
`//SECRET
-- sig a {}
/* sig a {} */
lone sig b {}`
        res = extractSecrets(code)
        assert.equal(res.public, "")
        assert.equal(res.secret, code)  
    });
    test("returns correct public and secret", function() {
        let public_code = `
sig Employee{}

sig Department{}
one sig Company {
    isDirectorOf: Employee -> Department
}

//write a prediate Quizz to check that
fact Quizz {
    // In a company, each department has exactly one director (chosen among 
    // the company's employees), but each employee can only be the director 
    // of at most one department
        all d: Department | one  Company.isDirectorOf.d
    all e: Employee   | lone Company.isDirectorOf[e]
}`
        let private_code = `//SECRET
assert validQuizz {
        all d: Department | one  Company.isDirectorOf.d 
    all e: Employee   | lone Company.isDirectorOf[e]
}

//SECRET
check validQuizz for 5`
        code = public_code + private_code
        res = extractSecrets(code)
        assert.equal(res.public, public_code)
        assert.equal(res.secret, private_code)

        code = 
`//SECRET
sig A {}
pred checkStuff{

}`
        res = extractSecrets(code)
        assert.equal(res.public, "\npred checkStuff{\n\n}")
        assert.equal(res.secret, "//SECRET\nsig A {}")

        code = 
`//SECRET
sig A {} //SECRETs
pred checkStuff{

}`
        res = extractSecrets(code)
        assert.equal(res.public, "//SECRETs\npred checkStuff{\n\n}")
        assert.equal(res.secret, "//SECRET\nsig A {} ")

        code = 
`//SECRET
sig A{} sig B {}`
        res = extractSecrets(code)
        assert.equal(res.public, " sig B {}")
        assert.equal(res.secret, "//SECRET\nsig A{}")

        code = 
`sig A{} //SECRET sig B {}`
        res = extractSecrets(code)
        assert.equal(res.public, code)
        assert.equal(res.secret, "")

        code = 
`sig A{}
    //SECRET    
    one   sig B {}
           sig C   {}`
        res = extractSecrets(code)
        assert.equal(res.public, "sig A{}\n    \n           sig C   {}")
        assert.equal(res.secret, "//SECRET    \n    one   sig B {}")

        code = 
`//SECRET //SECRET
sig a {}`
        res = extractSecrets(code)
        assert.equal(res.public, "//SECRET ")
        assert.equal(res.secret, "//SECRET\nsig a {}")        

        code = 
`/* comment */
//SECRET
  sig   a{}
`
        res = extractSecrets(code)
        assert.equal(res.public, "/* comment */\n")
        assert.equal(res.secret, "//SECRET\n  sig   a{}\n")        

        code = 
`//SECRET
sig   a{}

/* comment */
sig b {}
`
        res = extractSecrets(code)
        assert.equal(res.public, "/* comment */\nsig b {}\n")
        assert.equal(res.secret, "//SECRET\nsig   a{}\n\n")        

    });
});
