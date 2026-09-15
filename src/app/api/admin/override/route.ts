import { NextRequest, NextResponse } from 'next/server';
import { workflowService } from '@/services/workflow.service';

export async function POST(req: NextRequest) {
  try {
    const { orderId, adminUserId } = await req.json();

    if (!orderId || !adminUserId) {
      return NextResponse.json({ error: 'Missing orderId or adminUserId' }, { status: 400 });
    }

    await workflowService.adminOverrideLateSubmission(orderId, adminUserId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Override error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
