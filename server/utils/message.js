let generateMessage = (from,text) => {
    return{
        from,
        text,
        createdAt:new Date().getTime()
    };
};

let generateLocationMessage = (from, url) =>{
    return {
        from,
        url,
        
    }
}
module.exports = {generateMessage, generateLocationMessage};