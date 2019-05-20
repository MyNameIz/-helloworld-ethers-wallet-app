var express = require('express');
var router = express.Router();
var ethers = require('ethers');
var response = require('../utils/response');

const provider = ethers.getDefaultProvider("ropsten");
const etherScanProvider = new ethers.providers.EtherscanProvider("ropsten");

router.get('/:address', ( req,res,next ) => {
	if ( isAddress( req.params.address ) ) res.render("wallet", { title : "Wallet" });
	else res.redirect("/");
});

function isAddress (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        return false;
    } else return true;
};

router.post('/balance', async ( req,res,next ) => {
    try {
        if ( typeof req.body.address != "string" || !isAddress(req.body.address) ) 
        return response.Error(res, 400, "Valid wallet address is required");
        let balance = await provider.getBalance(req.body.address);
        console.log(balance);
        return response.Resp(res, 200, {
            "num" : ethers.utils.formatEther(balance),
            "obj" : balance
        });
    } catch ( err ) {
        console.error( err );
        return response.Error(res, 500, "An error occurred");
    }
});

router.post('/gasprice', async ( req,res,next ) => {
    try {
        let price = await provider.getGasPrice();
        console.log(price.toString());
        return response.Resp(res, 200, {
            "num" : ethers.utils.formatEther(price)
        });
    } catch ( err ) {
        console.error( err );
        return response.Error(res, 500, "An error occurred");
    }
});

router.post('/transactions', async ( req,res,next ) => {
    try {
        if ( typeof req.body.count != "number" || req.body.count == 0 )
            return response.Error(res, 400, "Transactions count required. Count should be equal or greater than 1.");
        if ( typeof req.body.offset != "number" || req.body.offset < 0 )
            return response.Error(res, 400, "Transactions history offset required. Offset should be equal or greater than 0.");
        if ( typeof req.body.address != "string" )
            return response.Error(res, 400, "Wallet address required");
        etherScanProvider.getHistory(req.body.address).then(history => {
            history.forEach(tx => tx.value = ethers.utils.formatEther(tx.value));
            return response.Resp(res, 200, history);
        });
    } catch( err ) {
        console.error( err );
        return response.Error(res, 500, "An error occurred");
    }
});

router.post('/send', async ( req,res,next ) => {
    try {
        if ( typeof req.body.to != "string" )
            return response.Error(res, 400, "Valid wallet receiver address required");
        if ( typeof req.body.amount != "string" )
            return response.Error(res, 400, "Valid ether amount required");
        if ( typeof req.body.privateKey != "string" )
            return response.Error(res, 400, "Wallet private key required");
        let amount = ethers.utils.parseEther(req.body.amount);
        let gas = await provider.getGasPrice();
        let wallet = new ethers.Wallet(req.body.privateKey, provider);
        wallet.sendTransaction({
            to : req.body.to,
            gasPrice : gas,
            value : amount
        }).then((resolve, reject) => {
            if ( reject ) {
                console.error(reject);
                throw new Error;
            } else {
                console.log(resolve);
                return response.Resp(res, 200, resolve);
            }
        });
    } catch ( err ) {
        console.error( err );
        return response.Error(res, 500, "An error occurred");
    }
});

module.exports = router;