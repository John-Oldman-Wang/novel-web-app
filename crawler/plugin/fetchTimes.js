const fetch = require('cross-fetch');



module.exports = function(times){
    return function(url){
        function f(){
            return fetch(url)
        }
        let pro = fetch(url)
        for(let i=1;i<times;i++){
            pro = pro.catch(err=>{
                console.log(`fecth ${url} ${i} times error`,err.message)
                return f()
            })
        }
        return pro;
    }
}