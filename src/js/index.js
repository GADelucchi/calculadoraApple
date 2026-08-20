const IVA = 0.21
const IIBB = 0.005
const ARANCEL_CREDITO = 0.0761
const ARANCEL_DEBITO = 0.038



const PAYMENT_METHODS = {
    efect:     { label: 'Efectivo',     type: 'ars', cuotas: 1, factor: (base) => base, coefCuotas: 1 },
    transfer:  { label: 'Transferencia',type: 'ars', cuotas: 1, factor: (base) => base * 1.05, coefCuotas: 1 },
    debit:     { label: 'Débito',       type: 'ars', cuotas: 1, factor: (base) => base / 0.70, coefCuotas: 1 },
    'credit-1':{ label: 'Crédito 1c',  type: 'ars', cuotas: 1, factor: (base) => base / 0.70, coefCuotas: 1 },
    'credit-3':{ label: 'Crédito 3c',  type: 'ars', cuotas: 3, factor: (base) => base / 0.70, coefCuotas: 1.0620 },
    'credit-6':{ label: 'Crédito 6c',  type: 'ars', cuotas: 6, factor: (base) => base / 0.70, coefCuotas: 1.1030 },
    'credit-9':{ label: 'Crédito 9c',  type: 'ars', cuotas: 9, factor: (base) => base / 0.70, coefCuotas: 1.1530 },
    'credit-12':{ label: 'Crédito 12c',type: 'ars', cuotas: 12, factor: (base) => base / 0.70, coefCuotas: 1.1950 },
    'credit-18':{ label: 'Crédito 18c',type: 'ars', cuotas: 18, factor: (base) => base / 0.70, coefCuotas: 1.2610 },
    paypal:    { label: 'PayPal',       type: 'usd', cuotas: 1, factor: (base) => base * 1.20, coefCuotas: 1 },
    usdt:      { label: 'USDT',         type: 'usd', cuotas: 1, factor: (base) => base * 1.02, coefCuotas: 1 },
}

const formatARS = (n) => n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 })
const formatUSD = (n) => n.toLocaleString('es-AR', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })

function calcDolarAPesos() {
    const dollarBase = parseFloat(document.getElementById('dollarInput').value)
    const dollarPlus = dollarBase + 50
    const method = document.getElementById('methodSelect').value
    const efectRaw = parseFloat(document.getElementById('efectInput').value) || 0

    let priceDollar = parseFloat(document.getElementById('priceDollarInput').value)

    if (efectRaw > 0) {
        priceDollar -= efectRaw / dollarPlus
    }

    const config = PAYMENT_METHODS[method]
    if (!config) return

    const baseResult = config.factor(priceDollar * (config.type === 'ars' ? dollarPlus : 1))
    const clientResult = baseResult * config.coefCuotas
    const cuotaResult = clientResult / config.cuotas

    let texto

    if (config.type === 'usd') {
        texto = `El total es de ${formatUSD(baseResult)}`
    } else if (config.cuotas === 1) {
        texto = `El total a cobrar es ${formatARS(clientResult)} en ${config.cuotas} cuota`
    // } else if (method === 'credit-3') {
    //     texto = `Total que se le cobrará al cliente en el posnet: ${formatARS(clientResult)} en ${config.cuotas} pagos de ${formatARS(cuotaResult)}.\n` +
    //             `Total a ingresar en el posnet: ${formatARS(clientResult)}.`
    // } else {
    //     texto = `Total que se le cobrará al cliente en el posnet: ${formatARS(clientResult)} en ${config.cuotas} pagos de ${formatARS(cuotaResult)}.\n` +
    //             `Total a ingresar en el posnet: ${formatARS(baseResult)}.`
    // }
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