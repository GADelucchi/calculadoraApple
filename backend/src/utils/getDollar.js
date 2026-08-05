// Imports
const axios = require('axios');
const cheerio = require('cheerio');

// Cache
let cachedDollar = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

// Code
const getDollarBlue = async () => {
  try {
    // Verificar si el caché es válido
    if (cachedDollar && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
      console.log('Usando valor en caché:', cachedDollar);
      return cachedDollar;
    }

    // Obtener HTML de dolarhoy.com
    const { data } = await axios.get('https://www.dolarhoy.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(data);

    // Buscar el valor VENTA del dólar blue
    // Los valores están en divs con clase "value" dentro de elementos con data-currency="blue"
    let dollarValue = null;

    // Estrategia 1: Buscar por data-currency="blue" y luego el valor de venta
    $('.cotizacion[data-currency="blue"]').each((index, element) => {
      const venta = $(element).find('.venta .value').text().trim();
      if (venta) {
        dollarValue = venta;
        return false; // Break
      }
    });

    // Si no encuentra con la estrategia 1, intentar estrategia 2
    if (!dollarValue) {
      $('div').each((index, element) => {
        const text = $(element).text();
        // Buscar un patrón que contenga "Venta" y un número
        if (text.includes('Venta') && text.match(/\d+[,|.]\d+/)) {
          const match = text.match(/(\d+[,|.]\d+)/);
          if (match) {
            dollarValue = match[1];
            return false; // Break
          }
        }
      });
    }

    if (!dollarValue) {
      throw new Error('No se pudo extraer el valor del dólar blue de dolarhoy.com');
    }

    // Guardar en caché
    cachedDollar = dollarValue;
    cacheTimestamp = Date.now();

    console.log('Dólar Blue scrapeado de dolarhoy.com:', dollarValue);
    return dollarValue;

  } catch (error) {
    console.error('Error al scrapear dolarhoy.com:', error.message);
    
    // Si hay error pero hay caché, retornar el caché aunque esté expirado
    if (cachedDollar) {
      console.log('Retornando caché por error:', cachedDollar);
      return cachedDollar;
    }

    throw new Error(`No se pudo obtener el valor del dólar: ${error.message}`);
  }
};

// Exports
module.exports = {
  getDollarBlue
}