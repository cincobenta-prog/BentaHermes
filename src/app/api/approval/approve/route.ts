import { NextRequest, NextResponse } from 'next/server';
import { workflowService } from '@/services/workflow.service';
import { canvaService } from '@/services/canva.service';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    // Find order by token (simplified: using token as orderId for demo)
    const order = await prisma.order.findUnique({ where: { id: token } });
    if (!order) {
      return NextResponse.json({ error: 'Invalid approval token' }, { status: 404 });
    }

    // 1. Update status to APPROVED
    await workflowService.transitionStatus(order.id, 'APPROVED');

    // 2. Generate Print-Ready PDF/X via Canva
    const pdfUrl = await canvaService.exportToPdfX(order.id);

    // 3. Update order with final PDF URL and mark as PRINT_READY
    await prisma.order.update({
      where: { id: order.id },
      data: {
        finalPdfUrl: pdfUrl,
        status: 'PRINT_READY',
      },
    });

    // 4. Email delivery to print shop (Placeholder)
    console.log(`Emailing PDF to print shop: ${pdfUrl}`);

    // 5. Final status: DELIVERED
    await workflowService.transitionStatus(order.id, 'DELIVERED');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Approval error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
