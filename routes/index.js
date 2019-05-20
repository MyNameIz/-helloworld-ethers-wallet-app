var express = require('express');
var router = express.Router();
var ethers = require('ethers');
var response = require('../utils/response');
var mongoose = require('mongoose');

const provider = ethers.getDefaultProvider("ropsten");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Entry' });
});



router.get('/create', ( req,res,next ) => {
	res.render('create', { title : "Create New Wallet" });
});

router.post('/', async (req,res,next) => {
	if ( !ethers.utils.HDNode.isValidMnemonic(req.body.mnemonic) ) return response.Error(res, 400, "Invalid mnemonic");
	if ( !req.body.password ) return response.Error(res, 400, "Wallet password required");
	let privateKey = ethers.Wallet.fromMnemonic(req.body.mnemonic).signingKey.privateKey;
	console.log(privateKey);
	let wallet = new ethers.Wallet(privateKey, provider);
	console.log(wallet);
	let code = await provider.getCode(wallet.address);
	if (code !== '0x') return response.Error(res, 400, 'Cannot sweep to a contract');
	else {
		return response.Resp(res, 200, {
			privateKey : wallet.signingKey.privateKey,
			publicKey : wallet.signingKey.publicKey,
			address : wallet.address
		});
	}
});

router.post('/create', async ( req,res,next ) => {
	if ( typeof req.body.password != "string" ) return response.Error(res, 400, "Valid password string required");
	try {
		let bytes = ethers.utils.randomBytes(16);
		let language = ethers.wordlists.en;
		let randomMnemonic = ethers.utils.HDNode.entropyToMnemonic(bytes, language)
		let wallet = new ethers.Wallet.fromMnemonic(randomMnemonic);
		console.log(wallet);
		let privateKey = wallet.signingKey.privateKey;
		wallet.provider = provider;
		wallet = new ethers.Wallet(privateKey, provider);
		wallet.encrypt(req.body.password);
		console.log(wallet);
		return response.Resp(res, 200, {
			mnemonic : randomMnemonic,
			password : req.body.password,
			address : wallet.address
		});
	} catch ( err ) {
		console.error( err );
		return response.Error(res, 500, "An error occurred");
	}
});

module.exports = router;
