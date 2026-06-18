import { PDFParse } from 'pdf-parse';

const extractedText = async (pdfBuffer:Buffer) => {
    try {
        const parser = new  PDFParse({data: pdfBuffer});
        const data = await parser.getText();
        return {
            text: data.text,
            totalPages: data.total
        }
    } catch (error) {
        console.error("PDF Parse error:", error);
        throw error;
    }
}
export default extractedText;