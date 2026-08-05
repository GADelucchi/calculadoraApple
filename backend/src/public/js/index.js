// Variable global - URL dinámica según el host
const getApiUrl = () => {
    const host = window.location.host;
    const protocol = window.location.protocol;
    
    // Si está en localhost, usar localhost
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
        return `http://${host}/api/dollar`;
    }
    
    // Si está en Render, usar HTTPS
    return `https://${host}/api/dollar`;
};

const url = getApiUrl();
let dollarBlue
let dollarPlusEfect

// Declaración de funciones
const fetchDollarBlue = async () => {
    try {
        const dollarElement = document.getElementById('dollar-value');
        dollarElement.innerText = 'Cargando cotización...';
        dollarElement.style.color = '#6c757d'; // Color gris para indicar carga

        console.log('🔗 Conectando a:', url); // Debug: mostrar URL siendo usada

        const response = await fetch(url);
        console.log(response);

        if (!response.ok) {
            throw new Error('Error al obtener el dólar blue');
        }
        const data = await response.json(); // Convierte la respuesta a JSON
        console.log(data);

        if (!data.success || !data.dollarBlue) {
            throw new Error('Respuesta inválida del servidor');
        }

        console.log('Dólar Blue desde el servidor:', data.dollarBlue); // Muestra el valor en la consola

        dollarBlue = parseFloat(data.dollarBlue);

        if (isNaN(dollarBlue)) {
            throw new Error('Valor de dólar inválido');
        }

        updateDollarValue();
        dollarElement.style.color = '#000'; // Volver a color normal
    } catch (error) {
        console.error('Error al obtener el dólar:', error);
        document.getElementById('dollar-value').innerText = `Error: No se pudo obtener la cotización (${error.message})`;
        document.getElementById('dollar-value').style.color = '#dc3545'; // Color rojo para error
    }
};

const updateDollarValue = () => {
    dollarPlusEfect = dollarBlue + 50;
    console.log(dollarPlusEfect);

    // Actualiza el DOM
    document.getElementById('dollar-value').innerText = `Dólar Blue: $${dollarBlue.toFixed(2)} | Venta+50: $${dollarPlusEfect.toFixed(2)}`;
};

// Escuchar los cambios en tiempo real con EventSource
// const eventSource = new EventSource(streamUrl);
// eventSource.onmessage = function (event) {
//     dollarBlue = parseFloat(event.data); // Actualiza el valor del dólar
//     updateDollarValue(); // Actualiza la UI con el nuevo valor
// };

// calculate1 calcula de dólares a pesos con los distintos métodos de pago
calculate1 = async () => {
    // Refrescar el valor del dólar antes de calcular
    await fetchDollarBlue();

    // Validar que se haya obtenido el valor del dólar
    if (!dollarBlue || isNaN(dollarBlue)) {
        console.error('No hay valor de dólar disponible para calcular');
        document.getElementById('resultText1').textContent = 'Error: No se pudo obtener el valor del dólar. Intenta nuevamente.';
        return;
    }

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
calculate2 = async () => {
    // Refrescar el valor del dólar antes de calcular
    await fetchDollarBlue();

    // Validar que se haya obtenido el valor del dólar
    if (!dollarBlue || isNaN(dollarBlue)) {
        console.error('No hay valor de dólar disponible para calcular');
        document.getElementById('resultText2').textContent = 'Error: No se pudo obtener el valor del dólar. Intenta nuevamente.';
        return;
    }

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
document.getElementById('calculateForm1').addEventListener('submit', async function (event) {
    event.preventDefault();
    await calculate1();
})

document.getElementById('calculateForm2').addEventListener('submit', async function (event) {
    event.preventDefault();
    await calculate2();
})

// Ejecución al cargar la página
window.onload = fetchDollarBlue()