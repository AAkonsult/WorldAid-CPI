const urlParams = new URLSearchParams(window.location.search);

document.getElementById('txnNo').innerHTML = urlParams.get('TxnNo');
document.getElementById('taxAmount').innerHTML = "$" + urlParams.get('TaxAmount');
document.getElementById('donationAmount').innerHTML = "$" + urlParams.get('DonationAmount');
document.getElementById('totalAmount').innerHTML = "$" + urlParams.get('TotalAmount');
document.getElementById('firstName').innerHTML = "Thank you, " +  urlParams.get('FirstName') + "!";