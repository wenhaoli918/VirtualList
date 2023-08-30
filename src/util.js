export const throttle = function(fn,delay){
  let canUse = true
  return function(){
    if(canUse){
      fn.call(this,...arguments)
      canUse = false
      setTimeout(() => {
        canUse = true
      },delay)
    }
  }
}