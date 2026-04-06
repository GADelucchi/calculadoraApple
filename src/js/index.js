// Variable global

// calculate1 calcula de dólares a pesos con los distintos métodos de pago
calculate1 = () => {
    let price = parseFloat(document.getElementById('priceDollarInput').value);
    let dollarBlue = parseFloat(document.getElementById('dollarInput').value);
    let dollarPlus = dollarBlue + 50
    let efect = parseFloat(document.getElementById('efectInput').value);
    let method = document.getElementById('methodSelect').value;
    let result;
    let pagos;
    let efectDollarized;
    let resultCuotas;

    if (!efect) {
        efect = 0;
    } else {
        efectDollarized = efect / dollarPlus;
        price = price - efectDollarized;
    }

    switch (method) {
        case 'efect':
            result = price * dollarPlus
            clientResult = result
            pagos = 1
            resultCuotas = result
            break;
        case 'transfer':
            result = price * dollarPlus * 1.05
            clientResult = result
            pagos = 1
            resultCuotas = result
            break;
        case 'debit':
            result = price * dollarPlus * 1.25
            clientResult = result
            pagos = 1
            resultCuotas = result
            break;
        case 'credit-1':
            result = price * dollarPlus * 1.25
            clientResult = result
            pagos = 1
            resultCuotas = result
            break;
        case 'credit-3':
            result = price * dollarPlus * 1.25
            clientResult = result * 1.0983
            pagos = 3
            resultCuotas = clientResult / pagos
            break;
        case 'credit-6':
            result = price * dollarPlus * 1.25
            clientResult = result * 1.1867
            pagos = 6
            resultCuotas = clientResult / pagos
            break;
        case 'credit-9':
            result = price * dollarPlus * 1.25
            clientResult = result * 1.4733
            pagos = 9
            resultCuotas = clientResult / pagos
            break;
        case 'credit-12':
            result = price * dollarPlus * 1.25
            clientResult = result * 1.6524
            pagos = 12
            resultCuotas = clientResult / pagos
            break;
        case 'credit-18':
            result = price * dollarPlus * 1.25
            clientResult = result * 2.0716
            pagos = 18
            resultCuotas = clientResult / pagos
            break;
        case 'paypal':
            result = price * 1.20
            clientResult = result * 1;
            pagos = 1
            resultCuotas = result
            break;
        case 'usdt':
            result = price * 1.02
            clientResult = result * 1;
            pagos = 1
            resultCuotas = result
            break;
        default:
            result = price
            break;
    }

    let formattedResult = result.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    })

    let formattedClientResult = clientResult.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
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
        document.getElementById('resultText1').textContent = `Total ${formattedClientResult} en ${pagos} pago`
    } else if (method === 'credit-3' ||
        method === 'credit-6' ||
        method === 'credit-9' ||
        method === 'credit-12') {
        document.getElementById('resultText1').textContent = `Total que se le cobrará al cliente en el posnet: ${formattedClientResult} en ${pagos} pagos de ${formattedResultCuota}.
        Total a ingresar en el posnet: ${formattedResult}.`
    } else if (method === 'paypal' ||
        method === 'usdt') {
        document.getElementById('resultText1').textContent = `Total US${formattedResult} en ${pagos} pago`
    }
}

// calculate2 calcula de pesos a dólares (pensado más que nada para accesorios)
calculate2 = () => {
    let price = parseFloat(document.getElementById('pricePesosInput').value)
    let dollarBlue = parseFloat(document.getElementById('dollarInput2').value)
    let result = 0

    result = price / dollarBlue

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

// Ejecución al cargar la página
// window.onload = fetchDollarBlue