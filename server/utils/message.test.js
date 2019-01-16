const expect = require('expect');

let {generateMessage} = require('./message');

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