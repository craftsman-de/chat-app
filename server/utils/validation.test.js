const expect = require('expect');
const {isRealString} = require('./validation');

describe('should validate a string', () =>{
    let badstring0 = { };
    let goodstring0 = "bob";
    let goodstring1 = "4*£48";
    let badstring1 = "  ";
    let badstring2 = 45;
    let goodstringwithspaces = "bob white";
    it('should reject non string values', () =>{
        
        let result = isRealString(badstring0);
        let result2 = isRealString(badstring2);

        expect(result).toBeFalsy();
        expect(result2).toBeFalsy();
    });
    it('should reject string with only spaces', ()=>{
        let result = isRealString(badstring1);
        expect(result).toBeFalsy();
    });
    it('should allow string with non-space characters', ()=>{
        let result0 = isRealString(goodstring0);
        let result1 = isRealString(goodstring1);
        let result2 = isRealString(goodstringwithspaces);
        expect(result0).toBeTruthy();
        expect(result1).toBeTruthy();
        expect(result2).toBeTruthy();
    });
});