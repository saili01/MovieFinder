const debounce=(func,delay=1000)=>{
    let timeoutId;
    return(...args) =>{
        if(timeoutId){
            clearInterval(timeoutId); //we are clearing the timeout set for previous character input to avoid fetching incomplete input 
        }
        timeoutId=setTimeout(()=>{
            func.apply(null,args);
        },delay);
    };
};