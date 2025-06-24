const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");

const extraerFormulas = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ningún archivo PDF." });
    }

    const pdfPath = path.join(__dirname, "../uploads", req.file.filename);
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    const texto = data.text;

    const regexFormulas = /^[A-Z0-9\s\*\/\+\-\(\)\.,√^#=]+=[^\n]+/gm;
    const formulas = texto.match(regexFormulas) || [];

    res.json({ formulas });
  } catch (error) {
    console.error("❌ Error al procesar PDF:", error.message);
    res.status(500).json({ error: "Error al procesar el PDF" });
  }
};

const extraerFormulaDesdeImagen = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ninguna imagen." });
    }

    const resultado = await Tesseract.recognize(req.file.buffer, "eng", {
  langPath: path.join(__dirname, "../tessdata"),
});


    const texto = resultado.data.text.trim();
    res.json({ formula: texto });
  } catch (error) {
    console.error("❌ OCR error:", error.message);
    res.status(500).json({ error: "No se pudo procesar la imagen." });
  }
};

module.exports = {
  extraerFormulas,
  extraerFormulaDesdeImagen
};
