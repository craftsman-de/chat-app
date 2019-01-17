const expect = require('expect');

const {Users} = require('./users');

describe('Users', ()=>{
  
    beforeEach( () => {
        users = new Users();
        users.users = [{
            id:'1',
            name: 'Harry',
            room: 'Node Course'
        },{
            id:'2',
            name: 'Mint',
            room: 'React Course'
        },{
            id:'3',
            name: 'Abe',
            room: 'Node Course'
        }];
    });
    it('should add a new user', ()=>{
        var users = new Users();
        var user = {
            id:'123',
            name:'donk',
            room:'milkyway'
        };
        var resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should return names for node course', () => {
        let userList = users.getUserList('Node Course');

        expect(userList).toEqual(['Harry', 'Abe']);
    });
    it('should return names for react course', () => {
        let userList = users.getUserList('React Course');

        expect(userList).toEqual(['Mint']);
    });
    it('should return a user (correctid)', () => {
        let user = users.getUser('2');

        expect(user.name).toEqual('Mint');
    });
    it('should not return a user (incorrectId)', () => {
        let user = users.getUser('45');
         expect(user).toBeFalsy();
    });
    it('should not delete a user (incorrectId)', () => {
        let result = users.removeUser('45');
         expect(result).toBe(0);
         expect(users.users.length).toBe(3);
    });
    it('should delete a user', () => {
        let result = users.removeUser('1');
         expect(result).toMatchObject({name:'Harry'});
         expect(users.users.length).toBe(2);
    });
});