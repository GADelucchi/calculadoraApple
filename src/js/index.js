const IVA = 0.21
const IIBB = 0.005
const ARANCEL_CREDITO = 0.0761
const ARANCEL_DEBITO = 0.038

// Margen extra que se busca retener por cobrar con tarjeta
const MARKUP_TARJETA = 1.05

// Como todas las tasas se aplican sobre el mismo total, se suman (no se encadenan divisiones)
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

function calcDolarAPesos() {
    const dollarBase = parseFloat(document.getElementById('dollarInput').value)
    const dollarPlusEfect = dollarBase + 50
    const method = document.getElementById('methodSelect').value
    const efectRaw = parseFloat(document.getElementById('efectInput').value) || 0

    let priceDollar = parseFloat(document.getElementById('priceDollarInput').value)

    if (efectRaw > 0) {
        priceDollar -= efectRaw / dollarPlusEfect
    }

    const config = PAYMENT_METHODS[method]
    if (!config) return

        // Calcular resultado
    const dollarToUse = config.type === 'ars' ? dollarPlusEfect : 1;
    const clientResult = priceDollar * dollarToUse * config.factor;
    const cuotaResult = clientResult / config.cuotas;

    let texto

    if (config.type === 'usd') {
        texto = `El total es de ${formatUSD(baseResult)}`
    } else if (config.cuotas === 1) {
        texto = `El total a cobrar es ${formatARS(clientResult)} en ${config.cuotas} cuota`
    } else {
        texto = `El total a cobrar es ${formatARS(clientResult)}, en ${config.cuotas} cuotas de ${formatARS(cuotaResult)} cada una.`
    }

    document.getElementById('resultText1').textContent = texto
}

function calcPesosADolares() {
    const price = parseFloat(document.getElementById('pricePesosInput').value)
    const dollarBlue = parseFloat(document.getElementById('dollarInput2').value)
    const result = price / dollarBlue

    document.getElementById('resultText2').textContent = `Total ${formatUSD(result)}`
}

document.getElementById('calculateForm1').addEventListener('submit', (e) => {
    e.preventDefault()
    calcDolarAPesos()
})

document.getElementById('calculateForm2').addEventListener('submit', (e) => {
    e.preventDefault()
    calcPesosADolares()
})