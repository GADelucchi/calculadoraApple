// Declaración de funciones
// calculate1 calcula de dólares a pesos con los distintos métodos de pago
calculate1 = () => {
    let price = parseFloat(document.getElementById('priceDollarInput').value)
    let dollar = parseFloat(document.getElementById('dollarInput1').value)
    let dollarPlusEfect = dollar + 50
    let dollarTransf = dollar + 50
    let dollarPlusFact = dollar + 100
    let efect = parseFloat(document.getElementById('efectInput').value)
    let method = document.getElementById('methodSelect').value
    let result = 0
    let pagos
    let efectDollarized
    let resultCuotas

    console.log("precio: " + price, "dolar: " + dollar, "dolar aumentado: " + dollarPlusEfect);

    if (!efect) {
        efect = 0
    } else {
        efectDollarized = efect / dollarPlusEfect
        price = price - efectDollarized
    }

    switch (method) {
        case 'efect':
            result = price * dollarPlusEfect
            pagos = 1
            resultCuotas = result
            break;
        case 'transfer':
            result = price * dollarTransf * 1.10
            pagos = 1
            resultCuotas = result
            break;
        case 'debit':
            result = price * dollarPlusFact * 1.35
            pagos = 1
            resultCuotas = result
            break;
        case 'credit-1':
            result = price * dollarPlusFact * 1.81
            pagos = 1
            resultCuotas = result
            break;
        case 'credit-3':
            result = price * dollarPlusFact * 1.81
            pagos = 3
            resultCuotas = result / pagos
            break;
        case 'credit-6':
            result = price * dollarPlusFact * 2.11
            pagos = 6
            resultCuotas = result / pagos
            break;
        case 'credit-9':
            result = price * dollarPlusFact * 2.41
            pagos = 9
            resultCuotas = result / pagos
            break;
        case 'credit-12':
            result = price * dollarPlusFact * 2.71
            pagos = 12
            resultCuotas = result / pagos
            break;
        case 'paypal':
            result = price * 1.20
            pagos = 1
            resultCuotas = result / pagos
            break;
        case 'usdt':
            result = price * 1.05
            pagos = 1
            resultCuotas = result / pagos
            break;
        default:
            result = price
            break;
    }

    let formattedResult = result.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    })

    let formattedResultCuota = resultCuotas.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    })

    if (method === 'efect' ||
        method === 'transfer' ||
        method === 'debit' ||
        method === 'credit-1') {
        document.getElementById('resultText1').textContent = `Total ${formattedResult} en ${pagos} pago`
    } else if (method === 'credit-3' ||
        method === 'credit-6' ||
        method === 'credit-9' ||
        method === 'credit-12') {
        document.getElementById('resultText1').textContent = `Total ${formattedResult} en ${pagos} pagos de ${formattedResultCuota}`
    } else if (method === 'paypal' ||
        method === 'usdt') {
        document.getElementById('resultText1').textContent = `Total UD${formattedResult} en ${pagos} pago`
    }
}

// calculate2 calcula de pesos a dólares (pensado más que nada para accesorios)
calculate2 = () => {
    let price = parseFloat(document.getElementById('pricePesosInput').value)
    let dollar = parseFloat(document.getElementById('dollarInput2').value)
    let result = 0

    result = price / dollar

    let formattedResult = result.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    })

    document.getElementById('resultText2').textContent = `Total ${formattedResult}`
}

// Ejecución onClick
document.getElementById('calculateForm1').addEventListener('submit', function (event) {
    event.preventDefault();
    calculate1();
})

document.getElementById('calculateForm2').addEventListener('submit', function (event) {
    event.preventDefault();
    calculate2();
})