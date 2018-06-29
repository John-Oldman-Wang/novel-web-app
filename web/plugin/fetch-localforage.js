import fetch from 'cross-fetch';
import localForage from 'localforage';


localForage.config({
    driver      : localForage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name        : 'novelApp',
    version     : 1.0,
    size        : 0, // Size of database, in bytes. WebSQL-only for now.
    storeName   : 'novel&chapter', // Should be alphanumeric, with underscores.
    description : 'some description'
});

// window.lf = localForage

const ruleForSavedToStorage = (url, option)=>{

    const urlObj = new URL(location.origin+url)
    // console.log(urlObj)
    if(urlObj.pathname=='/novel' || urlObj.pathname == '/chapter'){
        return true
    }
    return false
}

const getId = (url, option)=>{

    const urlObj = new URL(location.origin+url)
    if(urlObj.pathname=='/novel'){
        return urlObj.searchParams.get('v')
    }else if(urlObj.pathname == '/chapter'){
        return urlObj.searchParams.get('c')
    }
    return false
}
const f = (...arg)=>{
    //处理默认请求头
    if(arg[1]){
        let option = arg[1]
        option.headers = option.headers||{}
        Object.assign(option.headers,{
            'x-response-type': 'multipart'
        })
    }else{
        arg.push({
            headers:{
                'x-response-type': 'multipart'
            }
        })
    }

    if(ruleForSavedToStorage(...arg)){
        console.log('需要保存，先查本地库，')
        const id = getId(...arg)
        return localForage.getItem(id).then(blob=>{
            if(!!blob){//查到数据
                const url = URL.createObjectURL(blob)
                console.log('本地有数据',url)
                return fetch(url).then(res=>res.json())
                // console.log(`get item ${id}`)
                // return json
            }else{//未查到数据
                console.log(`get no item ${id}, `)
                return fetch(...arg).then(res=>{
                    return {
                        json: res.json(),
                        res: res
                    }
                }).then(({ json, res })=>{
                    if(json == null){
                        // 服务器无数据,交个 container 判断
                        return json
                    }else{
                        localForage.setItem(id, res._bodyBlob).then(()=>{
                            console.log(`save blob ok`)
                        }).catch(err=>{
                            console.log(`save blob error`,err)
                        })
                    }
                    // console.log(`fetch json`, json)
                    return json
                }) 
            }
        }).catch(err=>{//查询过程出错
            console.log('getItem err',err,id)
            return fetch(...arg).then(res=>{
                return res.json()
            })
        })
    }else{
        console.log('不需要保存')
        return fetch(...arg).then(res=>{
            return res.json()
        })
    }
}

export default f