module.exports=function(str){
    if(typeof str=='string'){
        if (/^\d{1,}$/.test(str)) {
            return str - 0
        } else if (/^[零|一|二|三|四|五|六|七|八|九|十|百|千|万|亿]{0,}$/.test(str)){
            var arr=str.split('')
            var obj={
                '零':0,
                '一':1,
                '二':2,
                '三':3,
                '四':4,
                '五':5,
                '六':6,
                '七':7,
                '八':8,
                '九':9,
                '十':10,
                '百':100,
                '千':1000,
                '万':10000,
                '亿':100000000
            }
        var end=str.replace(/^.{0,}?([十|百|千|万|亿]{0,1})$/,'$1')
        var basic=end?obj[end]:1
        var start=str.replace(/^([十|百|千|万|亿]{0,1}).*$/,'$1')
        var first=start?1:0
        console.log(start,'--',end)
        console.log(first,'--',basic)
        var  string= str.replace(/[十|百|千|万|亿]/g,'')
        for(var i in obj){
            string=string.replace(new RegExp(i,'g'),obj[i])
        }
        if(first){
            string='1'+string
        }
        return ( isNaN( parseInt(string) )?1:parseInt(string) )*basic

        }else{
            var floatStr=str.replace(/^[^\d]{0,}([^\r\n]{0,})$/,'$1')
            return isNaN(parseFloat(floatStr))?0:parseFloat(floatStr)
        }
    }else if(typeof str=='number'){
        return str
    }else{
        return 0
    }
}