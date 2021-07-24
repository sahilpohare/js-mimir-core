/**@param {string} input */
function tokenize(input){
    return input
        .toLowerCase()
        .replace(/\n/g, ' ')
        .replace(/[.,\/#!?$%\^&\*;:{}=_`\"~()]/g, ' ')
        .replace(/\s\s+/g, ' ')
        .trim()
        .split(' ');
}

export default function(req,res,rej){
    res(req.body.name + 'checked')
}

tokenize()