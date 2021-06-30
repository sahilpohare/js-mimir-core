let outlierFunction = function(array=[]) {
    if(array.length < 3) return;
    let hypothesis;
    
    let front = array[0] % 1;
    let back = array[array.length - 1] % 1;

    if(front === back){
        hypothesis = front;
    }else{
        if(front === array[1] % 1){
            return array[length - 1]
        }else{
            return array[0]
        }
    }
    console.log('hyp',hypothesis);
    return array.find((v,i)=> v % 1 !== hypothesis)
}

console.log(outlierFunction([1,3,4,5,7,9]))
console.log(outlierFunction([1,3,4,5,7,9]))
console.log(outlierFunction([2,6,4,6,7,8]))