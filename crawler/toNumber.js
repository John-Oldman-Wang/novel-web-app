module.exports=function(str){
    if(typeof str=='string'){
        if (/^\d{1,}$/.test(str)) {
            return str - 0
        } else if (/^[零|一|二|三|四|五|六|七|八|九|十|百|千|万|亿]{0,}$/.test(str)){
            var chnStr=str
            var chnNumChar = {
                零: 0,
                一: 1,
                二: 2,
                三: 3,
                四: 4,
                五: 5,
                六: 6,
                七: 7,
                八: 8,
                九: 9
            }
            var chnNameValue = {
                十: { value: 10, secUnit: false },
                百: { value: 100, secUnit: false },
                千: { value: 1000, secUnit: false },
                万: { value: 10000, secUnit: true },
                亿: { value: 100000000, secUnit: true }
            }
            if( /^十/.test(chnStr) ){
                chnStr ='一'+chnStr
            }
            chnStr=chnStr.replace(/零十/g,'零一十')
            var rtn = 0;
            var section = 0;
            var number = 0;
            var secUnit = false;
            var str = chnStr.split('');

            for (var i = 0; i < str.length; i++) {
                var num = chnNumChar[str[i]];
                if (typeof num !== 'undefined') {
                    number = num;
                    if (i === str.length - 1) {
                        section += number;
                    }
                } else {
                    var unit = chnNameValue[str[i]].value;
                    secUnit = chnNameValue[str[i]].secUnit;
                    if (secUnit) {
                        section = (section + number) * unit;
                        rtn += section;
                        section = 0;
                    } else {
                        section += (number * unit);
                    }
                    number = 0;
                }
            }
            return rtn + section;
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