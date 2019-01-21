
class Users {
    constructor () {
        this.users = [];
    }
    addUser (id, name, room) {
        let user = {id,name,room};
        this.users.push(user);
        return user;
    }
    removeUser (id) {
        
        for(let i=0;i<this.users.length;i++){
            if(this.users[i].id === id){
                let found = this.users[i];
                this.users.splice(i, 1);
                return found;
            }
        }
        return 0;
    }
    getUser (id) {
        let res;
        this.users.forEach(x=>{if(x.id === id){res=x;return;}})
        return res;
        
 
    }
    getUserList (room) {
        let users = this.users.filter(user => user.room === room);
        var namesArray = users.map( user => user.name);
        return namesArray;
    }
    getRooms(){
        let rooms = this.users.map(x=> x.room);
        let uniqrooms = [ ... new Set(rooms)];
        return uniqrooms;
    }
}
module.exports= {Users};