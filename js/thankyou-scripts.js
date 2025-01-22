const urlParams = new URLSearchParams(window.location.search);

if(urlParams.get('TxnNo') == null) {
    document.getElementById('txnNo').innerHTML = "N/A";
} else {
    document.getElementById('txnNo').innerHTML = urlParams.get('TxnNo');
}

if(urlParams.get('TaxAmount') == null) {
    document.getElementById('taxAmount').innerHTML = "N/A";
} else {
    document.getElementById('taxAmount').innerHTML = "$" + urlParams.get('TaxAmount');
}

if(urlParams.get('DonationAmount') == null) {
    document.getElementById('donationAmount').innerHTML = "N/A";
} else {
    document.getElementById('donationAmount').innerHTML = "$" + urlParams.get('DonationAmount');
}

if(urlParams.get('TotalAmount') == null) {
    document.getElementById('totalAmount').innerHTML = "N/A";
} else {
    document.getElementById('totalAmount').innerHTML = "$" + urlParams.get('TotalAmount');
}

if(urlParams.get('FirstName') == null) {
    document.getElementById('firstName').innerHTML = "Thank you!";
} else {
    document.getElementById('firstName').innerHTML = "Thank you, " +  urlParams.get('FirstName') + "!";
}