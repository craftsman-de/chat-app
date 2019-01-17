const expect = require('expect');

let {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', ()=> {
        let t1 = 'Duncasaurus';
        let t2 = 'weebles';
        let message = generateMessage(t1,t2);
        // expect(message.from).toBe(t1);
        // expect(message.text).toBe(t2);
        expect(message).toMatchObject({from:t1,text:t2});
        expect(typeof message.createdAt).toBe('number');

     
        
    });
});
describe('generateLocationMessage', ()=> {
    it('should generate correct location object', (done) => {
        let name = 'smeg';
        let lat = '123';
        let long = '543';
        let url = 'https://www.google.com/maps?q=123,543'
        let message= generateLocationMessage(name,lat,long);

        expect(message.from).toBe(name);
        expect(typeof message.createdAt).toBe('number');
        expect(message.url).toMatch(url);
        
        done();
    });
});