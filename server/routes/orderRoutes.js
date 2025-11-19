import express from 'express';
import PDFDocument from 'pdfkit';

const router = express.Router();

router.post('/create-invoice', (req, res) => {
    const { cartItems, total } = req.body;

    const doc = new PDFDocument();
    const filename = `invoice-${Date.now()}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Header
    doc.fontSize(25).text('Eco-Home Goods', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text('Factura de Compra', { align: 'center' });
    doc.moveDown();

    // Items
    doc.fontSize(12);
    cartItems.forEach(item => {
        doc.text(`${item.name} x${item.qty} - $${(item.price * item.qty).toFixed(2)}`, {
            align: 'left'
        });
        doc.moveDown(0.5);
    });

    doc.moveDown();
    doc.fontSize(16).text(`Total: $${total.toFixed(2)}`, { align: 'right' });

    doc.end();
});

export default router;
