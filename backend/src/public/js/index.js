// Variable global
const url = 'https://calculadoraappleserver.onrender.com/api/dollar'
// const streamUrl = 'https://calculadoraappleserver.onrender.com/api/dollar/stream'; // Ruta para el EventSource
let dollarBlue
let dollarPlusEfect

// Declaración de funciones
const fetchDollarBlue = async () => {
    try {
        const response = await fetch(url);
        console.log(response.json);

        if (!response.ok) {
            throw new Error('Error al obtener el dólar blue');
        }
        const data = await response.json(); // Convierte la respuesta a JSON
        console.log('Dólar Blue desde el servidor:', data.dollarBlue); // Muestra el valor en la consola

        dollarBlue = data.dollarBlue

        updateDollarValue()
    } catch (error) {
        console.error('Error:', error);
    }
};

const updateDollarValue = () => {
    dollarPlusEfect = dollarBlue + 50;
    console.log(dollarPlusEfect);

    // Actualiza el DOM
    document.getElementById('dollar-value').innerText = `Dólar Blue: $${dollarPlusEfect}`;
};

// Escuchar los cambios en tiempo real con EventSource
// const eventSource = new EventSource(streamUrl);
// eventSource.onmessage = function (event) {
//     dollarBlue = parseFloat(event.data); // Actualiza el valor del dólar
//     updateDollarValue(); // Actualiza la UI con el nuevo valor
// };

// calculate1 calcula de dólares a pesos con los distintos métodos de pago
calculate1 = () => {
    let price = parseFloat(document.getElementById('priceDollarInput').value);
    let dollarTransf = dollarPlusEfect
    let dollarPlusFact = dollarBlue + 100;
    let efect = parseFloat(document.getElementById('efectInput').value);
    let method = document.getElementById('methodSelect').value;
    let result = 0;
    let pagos;
    let efectDollarized;
    let resultCuotas;

    if (!efect) {
        efect = 0;
    } else {
        efectDollarized = efect / dollarPlusEfect;
        price = price - efectDollarized;
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
window.onload = fetchDollarBlue()