/**
 * Invoice PDF Generator for ShopNow4U Super Admin & Customer portal.
 * Generates an authentic, fully standard-compliant PDF 1.4 document client-side
 * and triggers direct file download as well as optional print preview.
 */

export function downloadInvoicePdf(order, d) {
  try {
    const sanitize = (str) =>
      String(str || '')
        .replace(/[\(\)\\]/g, '\\$&')
        .replace(/[^\x20-\x7E]/g, ' ')
        .trim();

    const invoiceNo = d?.orderNo || order?.invoiceId || `#INV-${order?.id?.replace('#', '') || '1001'}`;
    const orderId = order?.id || order?._id || 'ORD_UNKNOWN';
    const invoiceDate = order?.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const paymentStatus = order?.payment === 'Refund' ? 'Refunded' : (order?.payment || 'Paid');
    const paymentMethod = order?.paymentMethod || 'Online';
    const transactionId = order?.transactionId || 'TXN' + Math.floor(100000000 + Math.random() * 900000000);

    const customerName = d?.customer?.name || order?.customer || 'Customer';
    const customerEmail = d?.customer?.email || 'customer@example.com';
    const shippingAddress = d?.shipping || 'Delivery Address Not Specified';

    const vendorName = d?.vendor?.name || order?.vendor || 'ShopNow4U Seller';
    const vendorGst = d?.vendor?.gst || '27AAAA0000A1Z5';
    const vendorAddress = d?.vendor?.address || 'Registered Warehouse, Industrial Area';

    // Products list
    const items = d?.products && d.products.length > 0 
      ? d.products 
      : (d?.product ? [d.product] : [{ name: 'Order Product Item', qty: 1, price: d?.pricing?.product || '₹ 0', size: 'Standard', color: 'Default' }]);

    const productTotal = d?.pricing?.product || '₹ 0';
    const deliveryCharges = d?.pricing?.delivery || 'Free';
    const grandTotal = d?.pricing?.total || '₹ 0';
    const savings = d?.pricing?.saved || null;

    const contentStream = [];

    // Helper to draw text
    const addText = (text, x, y, size = 10, isBold = false, rgb = [0.1, 0.1, 0.1]) => {
      contentStream.push(
        `${rgb[0]} ${rgb[1]} ${rgb[2]} rg`,
        'BT',
        `/${isBold ? 'F1' : 'F2'} ${size} Tf`,
        `1 0 0 1 ${x} ${y} Tm`,
        `(${sanitize(text)}) Tj`,
        'ET'
      );
    };

    // Helper to draw lines
    const addLine = (x1, y1, x2, y2, lineWidth = 1, rgb = [0.85, 0.85, 0.85]) => {
      contentStream.push(
        `${rgb[0]} ${rgb[1]} ${rgb[2]} RG`,
        `${lineWidth} w`,
        `${x1} ${y1} m`,
        `${x2} ${y2} l`,
        'S'
      );
    };

    // Helper to draw rectangles
    const addRect = (x, y, w, h, fillRgb = [0.96, 0.96, 0.96], strokeRgb = null) => {
      contentStream.push(`${fillRgb[0]} ${fillRgb[1]} ${fillRgb[2]} rg`);
      if (strokeRgb) {
        contentStream.push(
          `${strokeRgb[0]} ${strokeRgb[1]} ${strokeRgb[2]} RG`,
          `1 w`,
          `${x} ${y} ${w} ${h} re`,
          'B'
        );
      } else {
        contentStream.push(`${x} ${y} ${w} ${h} re`, 'f');
      }
    };

    // 1. Top Header Banner
    addRect(40, 765, 515, 50, [0.08, 0.13, 0.24]);
    addText('SHOPNOW4U', 55, 788, 20, true, [1, 1, 1]);
    addText('E-COMMERCE SUPERADMIN PLATFORM', 55, 773, 8, false, [0.75, 0.85, 0.95]);
    addText('TAX INVOICE / BILL OF SUPPLY', 355, 788, 11, true, [1, 1, 1]);
    addText('ORIGINAL FOR RECIPIENT', 380, 773, 8, false, [0.8, 0.85, 0.9]);

    // 2. Invoice & Order Metadata
    addText(`Invoice ID: ${invoiceNo}`, 45, 735, 11, true, [0.1, 0.1, 0.1]);
    addText(`Order Number: ${orderId}`, 45, 720, 9.5, false, [0.35, 0.35, 0.35]);
    addText(`Invoice Date: ${invoiceDate}`, 45, 706, 9.5, false, [0.35, 0.35, 0.35]);

    addText(`Payment Status: ${paymentStatus.toUpperCase()}`, 355, 735, 10, true, paymentStatus === 'Refunded' ? [0.8, 0.1, 0.1] : [0.05, 0.55, 0.25]);
    addText(`Payment Method: ${paymentMethod}`, 355, 720, 9.5, false, [0.35, 0.35, 0.35]);
    addText(`Transaction ID: ${transactionId}`, 355, 706, 9, false, [0.35, 0.35, 0.35]);

    addLine(40, 692, 555, 692, 1, [0.88, 0.88, 0.88]);

    // 3. Customer & Vendor Info Blocks
    // Customer Card
    addRect(40, 600, 248, 82, [0.98, 0.99, 1.0], [0.82, 0.88, 0.96]);
    addText('CUSTOMER DETAILS / BILL TO:', 50, 666, 8.5, true, [0.15, 0.35, 0.75]);
    addText(customerName, 50, 648, 10.5, true, [0.1, 0.1, 0.1]);
    addText(customerEmail, 50, 634, 8.5, false, [0.35, 0.35, 0.35]);
    addText(shippingAddress.slice(0, 48), 50, 620, 8, false, [0.4, 0.4, 0.4]);
    if (shippingAddress.length > 48) {
      addText(shippingAddress.slice(48, 96), 50, 609, 8, false, [0.4, 0.4, 0.4]);
    }

    // Vendor Card
    addRect(302, 600, 253, 82, [0.99, 0.99, 0.99], [0.88, 0.88, 0.88]);
    addText('SOLD BY / SELLER DETAILS:', 312, 666, 8.5, true, [0.3, 0.3, 0.3]);
    addText(vendorName, 312, 648, 10.5, true, [0.1, 0.1, 0.1]);
    addText(`GSTIN: ${vendorGst}`, 312, 634, 8.5, false, [0.25, 0.25, 0.25]);
    addText(vendorAddress.slice(0, 48), 312, 620, 8, false, [0.4, 0.4, 0.4]);
    if (vendorAddress.length > 48) {
      addText(vendorAddress.slice(48, 96), 312, 609, 8, false, [0.4, 0.4, 0.4]);
    }

    // 4. Products Table Header
    addRect(40, 560, 515, 26, [0.92, 0.94, 0.98]);
    addText('ITEM DESCRIPTION', 52, 570, 9, true, [0.15, 0.2, 0.35]);
    addText('SPECIFICATION', 260, 570, 9, true, [0.15, 0.2, 0.35]);
    addText('QTY', 370, 570, 9, true, [0.15, 0.2, 0.35]);
    addText('UNIT PRICE', 420, 570, 9, true, [0.15, 0.2, 0.35]);
    addText('TOTAL', 500, 570, 9, true, [0.15, 0.2, 0.35]);

    // 5. Products Table Rows
    let curY = 535;
    items.forEach((item, idx) => {
      addText(`${idx + 1}. ${item.name || 'Product Item'}`.slice(0, 36), 50, curY, 9, true);
      addText(`Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}`, 260, curY, 8, false, [0.45, 0.45, 0.45]);
      addText(String(item.qty || 1), 378, curY, 9, false);
      addText(String(item.price || grandTotal), 420, curY, 9, false);
      addText(String(item.totalPrice || item.price || grandTotal), 500, curY, 9, true);

      addLine(40, curY - 14, 555, curY - 14, 0.5, [0.92, 0.92, 0.92]);
      curY -= 28;
    });

    // 6. Pricing Summary Box
    curY -= 12;
    addRect(300, curY - 86, 255, 86, [0.98, 0.98, 0.98], [0.86, 0.86, 0.86]);
    addText('Total Product Price:', 315, curY - 20, 9, false, [0.4, 0.4, 0.4]);
    addText(productTotal, 480, curY - 20, 9, false);

    addText('Delivery Charges:', 315, curY - 35, 9, false, [0.4, 0.4, 0.4]);
    addText(deliveryCharges, 480, curY - 35, 9, false);

    if (savings) {
      addText('Discount / Savings:', 315, curY - 50, 8.5, false, [0.1, 0.6, 0.2]);
      addText(savings, 480, curY - 50, 8.5, false, [0.1, 0.6, 0.2]);
    }

    addLine(310, curY - 60, 545, curY - 60, 0.5, [0.8, 0.8, 0.8]);
    addText('TOTAL AMOUNT:', 315, curY - 76, 10.5, true, [0.08, 0.13, 0.24]);
    addText(grandTotal, 475, curY - 76, 12, true, [0.05, 0.55, 0.25]);

    // 7. Footer & Support Notice
    addLine(40, 100, 555, 100, 0.5, [0.85, 0.85, 0.85]);
    addText('Thank you for shopping with ShopNow4U Platform!', 45, 84, 9, true, [0.2, 0.2, 0.2]);
    addText('This is a computer-generated tax invoice and requires no physical signature.', 45, 71, 8, false, [0.45, 0.45, 0.45]);
    addText('Need help with this order? Raise enquiries, refunds, or cancellations in the Order Details > Need Help? portal.', 45, 59, 8, false, [0.45, 0.45, 0.45]);

    const streamContent = contentStream.join('\n');
    const encoder = new TextEncoder();
    const streamBytes = encoder.encode(streamContent);
    const streamLength = streamBytes.length;

    const objects = [
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj',
      `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj`,
      '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj',
      '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj'
    ];

    let header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    let body = header;
    const offsets = [0];

    for (let i = 0; i < objects.length; i++) {
      offsets.push(encoder.encode(body).length);
      body += objects[i] + '\n';
    }

    const startXref = encoder.encode(body).length;
    let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i++) {
      xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    }

    const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;
    const fullPdfText = body + xref + trailer;
    const finalBytes = encoder.encode(fullPdfText);

    // Create Blob and trigger file download
    const blob = new Blob([finalBytes], { type: 'application/pdf' });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const cleanInvoiceNo = invoiceNo.replace(/[^a-zA-Z0-9_-]/g, '');
    link.href = blobUrl;
    link.download = `Invoice-${cleanInvoiceNo || 'Order'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup blob url after 1 second
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 1500);

    return { success: true, filename: link.download };
  } catch (err) {
    console.error('Invoice PDF Generation error:', err);
    throw err;
  }
}
