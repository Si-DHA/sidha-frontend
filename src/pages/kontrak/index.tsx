// pages/pdf.tsx
import PDFViewer from '../../app/components/PdfViewer';

const PDFPage: React.FC = () => {
  const pdfUrl = "https://cors-anywhere.herokuapp.com/https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  return (
    <div>
      <h1>PDF Viewer</h1>
      <PDFViewer url={pdfUrl} />
    </div>
  );
};

export default PDFPage;
