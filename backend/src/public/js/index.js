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

// Retenciones y comisiones, todas calculadas sobre el TOTAL cobrado
const IVA = 0.21
const IIBB = 0.005
const ARANCEL_CREDITO = 0.0761
const ARANCEL_DEBITO = 0.038

// Margen extra que se busca retener por cobrar con tarjeta
const MARKUP_TARJETA = 1.05

// Como todas las tasas se aplican sobre el mismo total, se suman (no se encadenan divisiones)
// const grossUp = (...tasas) => 1 / (1 - tasas.reduce((a, b) => a + b, 0))
const tarjeta = (...tasas) => MARKUP_TARJETA * grossUp(...tasas)

// Configuración de métodos de pago
const PAYMENT_METHODS = {
    efect: { label: 'Efectivo', type: 'ars', cuotas: 1, factor: 1 },
    transfer: { label: 'Transferencia', type: 'ars', cuotas: 1, factor: 1.05 },
    debit: { label: 'Débito', type: 'ars', cuotas: 1, factor: tarjeta(IVA, IIBB, ARANCEL_DEBITO) },
    'credit-1': { label: 'Crédito 1c', type: 'ars', cuotas: 1, factor: tarjeta(IVA, IIBB, ARANCEL_CREDITO, 0) },
    'credit-3': { label: 'Crédito 3c', type: 'ars', cuotas: 3, factor: tarjeta(IVA, IIBB, ARANCEL_CREDITO, 0.07502) },
    'credit-6': { label: 'Crédito 6c', type: 'ars', cuotas: 6, factor: tarjeta(IVA, IIBB, ARANCEL_CREDITO, 0.12463) },
    'credit-9': { label: 'Crédito 9c', type: 'ars', cuotas: 9, factor: tarjeta(IVA, IIBB, ARANCEL_CREDITO, 0.18513) },
    'credit-12': { label: 'Crédito 12c', type: 'ars', cuotas: 12, factor: tarjeta(IVA, IIBB, ARANCEL_CREDITO, 0.23595) },
    'credit-18': { label: 'Crédito 18c', type: 'ars', cuotas: 18, factor: tarjeta(IVA, IIBB, ARANCEL_CREDITO, 0.31581) },
    paypal: { label: 'PayPal', type: 'usd', cuotas: 1, factor: 1.20 },
    usdt: { label: 'USDT', type: 'usd', cuotas: 1, factor: 1.02 },
}

const formatARS = (n) => n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 })
const formatUSD = (n) => n.toLocaleString('es-AR', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })

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
    document.getElementById('dollar-value').innerText = `Dólar Blue: $${dollarBlue.toFixed(2)}`;
};

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
    let efect = parseFloat(document.getElementById('efectInput').value) || 0;
    let method = document.getElementById('methodSelect').value;

    // Obtener configuración del método
    const config = PAYMENT_METHODS[method];
    if (!config) return;

    // Descontar efectivo si aplica
    if (efect > 0) {
        price -= efect / dollarPlusEfect;
    }

    // Calcular resultado
    const dollarToUse = config.type === 'ars' ? dollarPlusEfect : 1;
    const clientResult = price * dollarToUse * config.factor;
    const cuotaResult = clientResult / config.cuotas;

    // Formatear y mostrar resultado
    let formattedResult = clientResult.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    });

    let formattedResultCuota = cuotaResult.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    });

    let texto = '';
    if (config.type === 'usd') {
        formattedResult = clientResult.toLocaleString('es-AR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        });
        texto = `El total es de ${formattedResult}`;
    } else if (config.cuotas === 1) {
        texto = `El total a cobrar es ${formattedResult} en ${config.cuotas} cuota`;
    } else {
        texto = `El total a cobrar es ${formattedResult} en ${config.cuotas} cuotas de ${formattedResultCuota} cada una`;
    }

    document.getElementById('resultText1').textContent = texto;
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
