module.exports=function(search){
    if(search==''){
        return {}
    }else{
        var str=search.replace(/^\?/,'').replace(/=/g,'":"').replace(/\&/g,'","')
        str='{"'+str+'"}'
        return JSON.parse(str)
    }
}