// Imports
const axios = require('axios');
const cheerio = require('cheerio');

// Cache
let cachedDollar = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

// Headers que simulan navegador real
const browserHeaders = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'es-AR,es;q=0.9',
  'Cache-Control': 'max-age=0',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1'
};

// Code
const getDollarBlue = async () => {
  try {
    // Verificar si el caché es válido
    if (cachedDollar && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
      console.log('Usando valor en caché:', cachedDollar);
      return cachedDollar;
    }

    console.log('📡 Obteniendo valor del dólar blue...');
    let dollarValue = null;

    // Estrategia 1: Intentar con dolarhoy.com
    try {
      dollarValue = await scrapeDolarHoy();
    } catch (error) {
      console.warn('⚠️ dolarhoy.com no disponible:', error.message);
    }

    // Estrategia 2: Intentar con API pública de bluelytics
    if (!dollarValue) {
      try {
        console.log('🔄 Intentando API de bluelytics...');
        dollarValue = await getFromBluelytics();
      } catch (error) {
        console.warn('⚠️ bluelytics no disponible:', error.message);
      }
    }

    if (!dollarValue) {
      throw new Error('No se pudo obtener el valor del dólar blue desde ninguna fuente');
    }

    // Guardar en caché
    cachedDollar = dollarValue;
    cacheTimestamp = Date.now();

    console.log('✅ Dólar Blue obtenido:', dollarValue);
    return dollarValue;

  } catch (error) {
    console.error('❌ Error al obtener dólar:', error.message);
    
    // Si hay error pero hay caché, retornar el caché aunque esté expirado
    if (cachedDollar) {
      console.log('⚠️ Usando caché expirado por error:', cachedDollar);
      return cachedDollar;
    }

    throw new Error(`No se pudo obtener el valor del dólar: ${error.message}`);
  }
};

const scrapeDolarHoy = async () => {
  try {
    const response = await axios.get('https://www.dolarhoy.com/', {
      timeout: 8000,
      headers: browserHeaders,
      maxRedirects: 5
    });

    const $ = cheerio.load(response.data);
    let dollarValue = null;

    // Buscar el valor VENTA del dólar blue
    // Estrategia 1: Buscar en el contenedor de cotizaciones
    $('div').each((index, element) => {
      const text = $(element).text();
      if (text.includes('BLUE') && text.includes('Venta')) {
        const match = text.match(/(\d+[.,]\d{1,2})/);
        if (match && match[1]) {
          dollarValue = match[1];
          return false; // Break
        }
      }
    });

    // Estrategia 2: Búsqueda general por número
    if (!dollarValue) {
      const bodyHTML = $('body').html();
      const matches = bodyHTML.match(/Venta[^0-9]*(\d+[.,]\d{1,2})/i);
      if (matches && matches[1]) {
        dollarValue = matches[1];
      }
    }

    if (!dollarValue) {
      throw new Error('No se encontró el valor de venta en dolarhoy.com');
    }

    return dollarValue;
  } catch (error) {
    throw new Error(`Error scrapeando dolarhoy.com: ${error.message}`);
  }
};

const getFromBluelytics = async () => {
  try {
    const response = await axios.get('https://api.bluelytics.com.ar/v2/latest', {
      timeout: 8000,
      maxRedirects: 5
    });

    if (response.data && response.data.blue && response.data.blue.value_sell) {
      const value = response.data.blue.value_sell.toString();
      console.log('✅ Valor obtenido de bluelytics:', value);
      return value;
    }

    throw new Error('Formato de respuesta inválido de bluelytics');
  } catch (error) {
    throw new Error(`Error en bluelytics API: ${error.message}`);
  }
};

// Función para obtener el valor actual sin caché (útil para debug)
const getDollarBlueFresh = async () => {
  cachedDollar = null;
  cacheTimestamp = null;
  return getDollarBlue();
};

// Exports
module.exports = {
  getDollarBlue,
  getDollarBlueFresh
};