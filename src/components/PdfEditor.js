import { useRef, useState } from "react";
import { Rnd } from "react-rnd";

function PdfEditor() {
  const containerRef = useRef(null);

  // Store position & size as percentages (CORE LOGIC)
  const [field, setField] = useState({
    xPercent: 0.2,
    yPercent: 0.3,
    widthPercent: 0.3,
    heightPercent: 0.1,
  });

  // Fixed render size for prototype
  const PDF_WIDTH = 600;
  const PDF_HEIGHT = 850;

  const onDragStop = (e, d) => {
    const rect = containerRef.current.getBoundingClientRect();

    setField((prev) => ({
      ...prev,
      xPercent: d.x / rect.width,
      yPercent: d.y / rect.height,
    }));
  };

  const onResizeStop = (e, dir, ref, delta, position) => {
    const rect = containerRef.current.getBoundingClientRect();

    setField({
      xPercent: position.x / rect.width,
      yPercent: position.y / rect.height,
      widthPercent: ref.offsetWidth / rect.width,
      heightPercent: ref.offsetHeight / rect.height,
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: PDF_WIDTH,
        height: PDF_HEIGHT,
        marginTop: 20,
        border: "1px solid #ccc",
        overflow: "hidden",
        background: "#f5f5f5",
      }}
    >
      {/* PDF layer */}
      <iframe
        src="https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf"
        title="PDF Document"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          pointerEvents: "none",
        }}
      />

      {/* Signature overlay */}
      <Rnd
        bounds="parent"
        size={{
          width: field.widthPercent * PDF_WIDTH,
          height: field.heightPercent * PDF_HEIGHT,
        }}
        position={{
          x: field.xPercent * PDF_WIDTH,
          y: field.yPercent * PDF_HEIGHT,
        }}
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
        style={{
          position: "absolute",
          border: "2px dashed #000",
          background: "rgba(255,255,255,0.75)",
          zIndex: 10,
          cursor: "move",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 500,
        }}
      >
        Signature
      </Rnd>
    </div>
  );
}

export default PdfEditor;
