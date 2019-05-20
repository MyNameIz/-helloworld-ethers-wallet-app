let submit = document.getElementById("submit");
if ( submit )
submit.onclick = function(e) {
    let mnemonic = document.getElementById("mnemonic").value;
    let password = document.getElementById("password").value;
    try {
        let response = enterWithWallet(mnemonic, password);
        let result = response.result;
        for ( var key in result ) window.localStorage.setItem(key,result[key]);
        window.location.href = `${window.location.protocol}/wallet/${window.localStorage.getItem("address")}`
    } catch ( err ) {
        console.error( err );
    }
}

let create = document.getElementById("create");
if ( create )
create.onclick = function(e) {
    let password = document.querySelector("input#password").value;
    console.log(password);
    let response = createWallet(password).result;
    console.log(response);
    if ( response != {} ) {
        document.getElementById("register").style.display = "none";
        document.querySelector("h5#mnemonic").innerHTML = response.mnemonic;
        document.querySelector("h5#password").innerHTML = response.password;
        document.querySelector("h5#address").innerHTML = response.address;
        document.getElementById("credentials").style.display = "block"
    } else alert("ERROR");
}

let refresh = document.getElementById("refresh");
if ( refresh ) {
    refresh.onclick = refreshPageInfo;
    refreshPageInfo();
}

let send = document.querySelector("button#send");
if ( send )
send.onclick = function(e) {
    let amount = document.querySelector("input#amount").value;
    let to = document.querySelector("input#address").value;
    let tx = sendEther( to, amount, window.localStorage.getItem("privateKey") );
    if ( tx != {} ) {
        alert("Transaction sent successfully");
        refreshPageInfo();
    } else alert("Error while sending transaction");
}

function refreshPageInfo(e) {
    let balance_ = document.querySelector("h1#balance");
    let balance = getBalance(window.localStorage.getItem("address"));
    balance_.innerHTML = balance.result.num+" eth";
    console.log(balance);
    let gasPrice = document.querySelector("input#gasPrice");
    let price = getGasPrice();
    gasPrice.value = price.result.num;
    let transactions = document.querySelector("ul#transactions");
    let history = getTransactionHistory( window.localStorage.getItem("address"), 5, 0);
    if ( history != {} ) {
        if ( transactions.querySelectorAll("li.row") )
            transactions.querySelectorAll("li.row").forEach(tx => tx.remove());
        history = history.result;
        for ( var i of history )
        transactions.innerHTML = transactions.innerHTML + `<li class="row">
            <ul class="col-12 list-unstyled">
                <li class="row d-flex" style="border:1px solid black">
                    <h5 class="col-12 text-center" style="color: ${i.to == window.localStorage.getItem("address") ? "green" : "red"}">
                        ${i.to == window.localStorage.getItem("address") ? "Received" : "Sent"}
                    </h5>
                    <p class="col-6 text-center">From: ${i.from}</p><p class="col-6 text-center">To: ${i.to}</p>
                    <p class="col-12 text-center">Amount: ${i.value}1</p>
                    <p class="col-12 text-center">Hash: ${i.hash}</p>
                </li>
            </ul>
        </li>`
    } else document.querySelector("ul#loading").querySelector("h2").innerHTML = "Error! Can't get transaction history";
}

