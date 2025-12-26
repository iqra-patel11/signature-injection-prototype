const express = require("express");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

const router = express.Router();

router.post("/sign-pdf", async (req, res) => {
  console.log("➡️ sign-pdf route hit");

  try {
    const {
      xPercent,
      yPercent,
      widthPercent,
      heightPercent,
      signatureBase64,
    } = req.body;

    console.log("📥 body received");

    if (!signatureBase64) {
      console.log("❌ signature missing");
      return res.status(400).json({ error: "Signature image is required" });
    }

    const parts = signatureBase64.split(",");
    if (parts.length !== 2) {
      console.log("❌ invalid base64");
      return res.status(400).json({ error: "Invalid base64 format" });
    }

    const pdfPath = path.join(__dirname, "../assets/source.pdf");
    console.log("📄 loading pdf:", pdfPath);

    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const page = pdfDoc.getPages()[0];
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    console.log("📐 page size", pageWidth, pageHeight);

    const boxWidth = widthPercent * pageWidth;
    const boxHeight = heightPercent * pageHeight;

    const pdfX = xPercent * pageWidth;
    const pdfY = pageHeight - (yPercent * pageHeight) - boxHeight;

    console.log("📍 coords calculated", pdfX, pdfY);

    const imageBuffer = Buffer.from(parts[1], "base64");
    const image = await pdfDoc.embedPng(imageBuffer);

    const scale = Math.min(
      boxWidth / image.width,
      boxHeight / image.height
    );

    const finalWidth = image.width * scale;
    const finalHeight = image.height * scale;

    const drawX = pdfX + (boxWidth - finalWidth) / 2;
    const drawY = pdfY + (boxHeight - finalHeight) / 2;

    page.drawImage(image, {
      x: drawX,
      y: drawY,
      width: finalWidth,
      height: finalHeight,
    });

    const signedBytes = await pdfDoc.save();
    const outPath = path.join(__dirname, "../signed.pdf");
    fs.writeFileSync(outPath, signedBytes);

    console.log("✅ response sent");

    res.json({
      message: "PDF signed successfully",
      file: "signed.pdf",
    });
  } catch (err) {
    console.error("🔥 ERROR", err);
    res.status(500).json({ error: "Internal error" });
  }
});

module.exports = router;
