function enterWithWallet( mnemonic, password ) {
    console.log(mnemonic, password);
    let enter = new XMLHttpRequest();
    let res = null;
    enter.onreadystatechange = function() {
        if(enter.readyState == XMLHttpRequest.DONE && enter.status == 200) {
            try {
                res = JSON.parse(enter.responseText);
            } catch ( err ) {
                throw new Error( err );
            }
        } else res = {};
    }
    enter.open("post", "/", false);
    enter.setRequestHeader("Content-Type", "application/json");
    enter.send(JSON.stringify({
        mnemonic : mnemonic,
        password : password
    }));
    return res;
}

function createWallet( password) {
    console.log(password);
    let enter = new XMLHttpRequest();
    let res = null;
    enter.onreadystatechange = function() {
        if(enter.readyState == XMLHttpRequest.DONE && enter.status == 200) {
            try {
                res = JSON.parse(enter.responseText);
            } catch ( err ) {
                throw new Error( err );
            }
        } else res = {};
    }
    enter.open("post", "/create", false);
    enter.setRequestHeader("Content-Type", "application/json");
    enter.send(JSON.stringify({
        password : password
    }));
    return res;
}

function getBalance( address ) {
    console.log(address);
    let enter = new XMLHttpRequest();
    let res = null;
    enter.onreadystatechange = function() {
        if(enter.readyState == XMLHttpRequest.DONE && enter.status == 200) {
            try {
                res = JSON.parse(enter.responseText);
            } catch ( err ) {
                throw new Error( err );
            }
        } else res = {};
    }
    enter.open("post", "/wallet/balance", false);
    enter.setRequestHeader("Content-Type", "application/json");
    enter.send(JSON.stringify({
        address : address
    }));
    return res;
}

function getGasPrice() {
    let enter = new XMLHttpRequest();
    let res = null;
    enter.onreadystatechange = function() {
        if(enter.readyState == XMLHttpRequest.DONE && enter.status == 200) {
            try {
                res = JSON.parse(enter.responseText);
            } catch ( err ) {
                throw new Error( err );
            }
        } else res = {};
    }
    enter.open("post", "/wallet/gasprice", false);
    enter.setRequestHeader("Content-Type", "application/json");
    enter.send(JSON.stringify({}));
    return res;
}

function getTransactionHistory( address, count, offset ) {
    let enter = new XMLHttpRequest();
    let res = null;
    enter.onreadystatechange = function() {
        if(enter.readyState == XMLHttpRequest.DONE && enter.status == 200) {
            try {
                res = JSON.parse(enter.responseText);
            } catch ( err ) {
                throw new Error( err );
            }
        } else res = {};
    }
    enter.open("post", "/wallet/transactions", false);
    enter.setRequestHeader("Content-Type", "application/json");
    enter.send(JSON.stringify({
        address : address,
        count : count,
        offset : offset
    }));
    return res;
}

function sendEther( to, amount, privateKey ) {
    let enter = new XMLHttpRequest();
    let res = null;
    enter.onreadystatechange = function() {
        if(enter.readyState == XMLHttpRequest.DONE && enter.status == 200) {
            try {
                res = JSON.parse(enter.responseText);
            } catch ( err ) {
                throw new Error( err );
            }
        } else res = {};
    }
    enter.open("post", "/wallet/send", false);
    enter.setRequestHeader("Content-Type", "application/json");
    enter.send(JSON.stringify({
        to : to,
        amount : amount,
        privateKey : privateKey
    }));
    return res;
}