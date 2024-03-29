function initPayPalButton() {
    var shipping = 0;
    var itemOptions = document.querySelector("#smart-button-container #item-options");
    var quantity = parseInt();
    var quantitySelect = document.querySelector("#smart-button-container #quantitySelect");
    if (!isNaN(quantity)) {
        quantitySelect.style.visibility = "visible";
    }
    var orderDescription = 'Recueils de poésie EMUNEZERO';
    if (orderDescription === '') {
        orderDescription = 'Item';
    }
    paypal.Buttons({
        style: {
            shape: 'pill',
            color: 'silver',
            layout: 'vertical',
            label: 'pay',

        },
        createOrder: function (data, actions) {
            var selectedItemDescription = itemOptions.options[itemOptions.selectedIndex].value;
            var selectedItemPrice = parseFloat(itemOptions.options[itemOptions.selectedIndex].getAttribute("price"));
            var tax = (0 === 0 || false) ? 0 : (selectedItemPrice * (parseFloat(0) / 100));
            if (quantitySelect.options.length > 0) {
                quantity = parseInt(quantitySelect.options[quantitySelect.selectedIndex].value);
            } else {
                quantity = 1;
            }

            tax *= quantity;
            tax = Math.round(tax * 100) / 100;
            var priceTotal = quantity * selectedItemPrice + parseFloat(shipping) + tax;
            priceTotal = Math.round(priceTotal * 100) / 100;
            var itemTotalValue = Math.round((selectedItemPrice * quantity) * 100) / 100;

            return actions.order.create({
                purchase_units: [{
                    description: orderDescription,
                    amount: {
                        currency_code: 'EUR',
                        value: priceTotal,
                        breakdown: {
                            item_total: {
                                currency_code: 'EUR',
                                value: itemTotalValue,
                            },
                            shipping: {
                                currency_code: 'EUR',
                                value: shipping,
                            },
                            tax_total: {
                                currency_code: 'EUR',
                                value: tax,
                            }
                        }
                    },
                    items: [{
                        name: selectedItemDescription,
                        unit_amount: {
                            currency_code: 'EUR',
                            value: selectedItemPrice,
                        },
                        quantity: quantity
                    }]
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (orderData) {

                // Full available details
                console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));

                // Show a success message within this page, e.g.
                const element = document.getElementById('paypal-button-container');
                element.innerHTML = '';
                element.innerHTML = '<h3>Thank you for your payment!</h3>';

                // Or go to another URL:  actions.redirect('thank_you.html');

                Email.send({
                    Host: "smtp.elasticemail.com",
                    Username: "estmwis@gmail.com",
                    Password: "3185CB8128FFAFF3D3444576FFA58D8F67EC",
                    To: 'estmwis@hotmail.com',
                    From: "estmwis@gmail.com",
                    Subject: "POESIE.E.MUNEZERO",
                    Body: "Nous voilà on se retrouve, tu trouveras ci-joint les document. pdf de ta commande.",
                    Attachments: [
                        {
                            name: "Synthèse-math-FSAB1101.pdf",
                            path: "https://api.smtprelay.co/userfile/229de541-a789-4dfa-a1a5-9e82e70098c5/Synthèse-math-FSAB1101.pdf"
                        }]
                }).then(
                    message => alert(message)
                );

            });
        },
        onError: function (err) {
            console.log(err);
        },
    }).render('#paypal-button-container');
}
initPayPalButton();






