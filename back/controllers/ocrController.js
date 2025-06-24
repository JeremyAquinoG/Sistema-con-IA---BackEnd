const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

const analizarArchivo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ningún archivo.' });
  }

  const filePath = path.resolve(__dirname, '..', req.file.path);
  const ext = path.extname(filePath).toLowerCase();

  const start = Date.now(); // ⏱ Inicio del cronómetro

  try {
    let textoExtraido = '';

    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);

      if (pdfData.text.trim().length > 0) {
        textoExtraido = pdfData.text;
      } else {
        textoExtraido = await extraerConTesseract(filePath);
      }

    } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      textoExtraido = await extraerConTesseract(filePath);

      // 🔍 Añadir texto extra de recorte donde va el número de certificado
      const certificadoExtra = await extraerCertificadoSolo(filePath);
      textoExtraido += '\n' + certificadoExtra;
    } else {
      return res.status(400).json({ message: 'Tipo de archivo no soportado.' });
    }

    const camposExtraidos = extraerCampos(textoExtraido);

    const end = Date.now(); // ⏱ Fin del cronómetro
    const tiempoProcesamiento = end - start;
    const cantidadPalabras = textoExtraido ? textoExtraido.split(/\s+/).filter(Boolean).length : 0;

    res.status(200).json({
      mensaje: "Datos extraídos correctamente",
      textoExtraido,
      camposExtraidos,
      tiempo_ms: tiempoProcesamiento,
      cantidad_palabras: cantidadPalabras
    });

  } catch (error) {
    console.error('Error al analizar archivo:', error);
    res.status(500).json({ message: 'Error al procesar el archivo.' });
  }
};

// 🧠 OCR general para toda la imagen
async function extraerConTesseract(filePath) {
  const resultado = await Tesseract.recognize(filePath, 'eng', {
    logger: m => console.log(m),
    tessedit_pageseg_mode: 6
  });
  return resultado.data.text;
}

// 📷 OCR específico solo en la zona del número de certificado
async function extraerCertificadoSolo(filePath) {
  const tempPath = filePath.replace(/\.(jpg|jpeg|png|pdf)$/, '_recorte.png');

  await sharp(filePath)
    .extract({ top: 150, left: 250, width: 500, height: 100 }) // ← ajusta según sea necesario
    .toFile(tempPath);

  const resultado = await Tesseract.recognize(tempPath, 'eng', {
    logger: m => console.log(m),
    tessedit_pageseg_mode: 6
  });

  fs.unlink(tempPath, () => {}); // borrar imagen recortada

  return resultado.data.text;
}

function extraerDatoPorEtiqueta(texto, etiqueta, siguienteEtiqueta) {
  const regex = new RegExp(`${etiqueta}\\s*[:\\-]?\\s*(.*?)\\s*(?=${siguienteEtiqueta ? siguienteEtiqueta : '\\n'})`, 'i');
  const match = texto.match(regex);
  return match ? match[1].trim() : null;
}

function extraerCampos(texto) {
  const campos = {};
  const tituloMatch = texto.match(/Certificado\s+de\s+Calibraci[oó]n/i);
  campos.nombreCertificado = tituloMatch ? tituloMatch[0].trim() : null;

  const certMatch = texto.match(/\b([A-Z]{1,4}\d{0,2}-[A-Z]-\d{5,7})\b/);
  campos.numeroCertificado = certMatch ? certMatch[1] : null;

  const profMatch = texto.match(/\bP-SMC-\d{3,4}-\d{4}\s*V\d\b/i);
  campos.numeroProforma = profMatch ? profMatch[0] : "P-SMC-000-2025 V0";

  const razonMatch = texto.match(/Raz[oó]n Social\s*[:\-]?\s*([^\n]+)/i);
  campos.razonSocial = razonMatch ? razonMatch[1].trim() : null;

  const direccionRegex = /dir\s*ecci[oó]n\s*[:\-]?\s*((?:.*\n?){1,2})/i;
  const direccionMatch = texto.match(direccionRegex);
  if (direccionMatch) {
    let direccionCruda = direccionMatch[1].replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim();
    campos.direccion = direccionCruda;
  } else {
    campos.direccion = null;
  }

  const fechaCalib = texto.match(/Fecha\s+de\s+Calibraci[oó]n\s*[:\-]?\s*(\d{4}[-\/\.]\d{2}[-\/\.]\d{2})/i);
  campos.fechaCalibracion = fechaCalib ? fechaCalib[1].replace(/[\/\.]/g, '-') : null;

  const lugarRegex = /Lugar\s*de\s*Calib\s*raci[oó]n\s*[:\-]?\s*(EN\s+EL\s+LABORATORIO.*?)\s*(?:Fecha\s+de\s+Emisión|$)/i;
  const lugarMatch = texto.replace(/\r?\n/g, ' ').match(lugarRegex);
  campos.lugarCalibracion = lugarMatch && lugarMatch[1] ? lugarMatch[1].trim() : null;

  const fechaEmi = texto.match(/Fecha\s+de\s+Emisi[oó]n\s*[:\-]?\s*(\d{4}[-\/\.]\d{2}[-\/\.]\d{2})/i);
  campos.fechaEmision = fechaEmi ? fechaEmi[1].replace(/[\/\.]/g, '-') : null;

  campos.marca = texto.match(/Marca\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;
  campos.modelo = texto.match(/Modelo\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;
  campos.serie = texto.match(/Serie\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;

  campos.procedencia = texto.match(/Procedencia\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;

  const identificacionMatch = texto.match(/Identificaci[oó]n\s*[:\-]?\s*([A-Z0-9\-]+)/i);
  campos.identificacion = identificacionMatch ? identificacionMatch[1] : null;

  campos.ubicacion = texto.match(/Ubicaci[oó]n\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;
  campos.capacidadIndicacion = texto.match(/Capacidad de Indicaci[oó]n\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;
  campos.resolucion = texto.match(/Resoluci[oó]n\s*\(d\)\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;
  campos.divisionVerificacion = texto.match(/Div\.? de Verificaci[oó]n \(e\)\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;

  const capacidadMinimaMatch = texto.match(/Cap(?:\.|\s)?\s*M[ií]nima\s*\(Min\.\)\s*[:\-]?\s*([^\n]+)/i);
  campos.capacidadMinima = capacidadMinimaMatch ? capacidadMinimaMatch[1].trim() : null;

  const numeroDivisionesMatch = texto.match(/N[uú]mero\s+de\s+Divisiones\s*\(n\)\s*[:\-]?\s*([^\n]+)/i);
  campos.numeroDivisiones = numeroDivisionesMatch ? numeroDivisionesMatch[1].trim() : null;

  const claseExactitudMatch = texto.match(/Clase\s+Exactitud\s*[:\-]?\s*([^\n\.]+)/i);
  campos.claseExactitud = claseExactitudMatch ? claseExactitudMatch[1].trim() : null;

  const metodoMatch = texto.match(/M[ÉE]TODO DE CALIBRACI[ÓO]N\s*[:\-]?\s*([\s\S]*?)(?=\n\s*(?:Marca|RESULTADOS|OBSERVACIONES|CONDICIONES|PATRONES|CERTIFICADO|Sello|Ubicación|$))/i);
  campos.metodoCalibracion = metodoMatch
    ? metodoMatch[1].replace(/\s{2,}/g, ' ').replace(/\r?\n|\r/g, ' ').trim()
    : null;

  return campos;
}

module.exports = { analizarArchivo };
