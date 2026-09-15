import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class WorkflowService {
  /**
   * Checks if a submission is late (less than 48 hours before due date).
   */
  async checkSubmissionDeadline(dueDate: Date): Promise<{ isLate: boolean; status: OrderStatus }> {
    const now = new Date();
    const diffInHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 48) {
      return { isLate: true, status: OrderStatus.PENDING_INTERNAL_APPROVAL };
    }

    return { isLate: false, status: OrderStatus.DRAFT };
  }

  /**
   * Transitions an order to the next status in the workflow.
   */
  async transitionStatus(orderId: string, newStatus: OrderStatus, userId?: string): Promise<void> {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');

    // Validate transition logic (simplified for this implementation)
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.DRAFT]: [OrderStatus.AWAITING_CLIENT_APPROVAL, OrderStatus.PENDING_INTERNAL_APPROVAL],
      [OrderStatus.PENDING_INTERNAL_APPROVAL]: [OrderStatus.DRAFT],
      [OrderStatus.AWAITING_CLIENT_APPROVAL]: [OrderStatus.APPROVED, OrderStatus.DRAFT],
      [OrderStatus.APPROVED]: [OrderStatus.PRINT_READY],
      [OrderStatus.PRINT_READY]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
    };

    if (!validTransitions[order.status].includes(newStatus)) {
      throw new Error(`Invalid status transition from ${order.status} to ${newStatus}`);
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    if (userId) {
      await prisma.approvalLog.create({
        data: {
          orderId,
          action: `TRANSITION_TO_${newStatus}`,
          userId,
        },
      });
    }
  }

  /**
   * Specifically handles the admin override for late submissions.
   */
  async adminOverrideLateSubmission(orderId: string, adminUserId: string): Promise<void> {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== OrderStatus.PENDING_INTERNAL_APPROVAL) {
      throw new Error('Order is not awaiting internal approval.');
    }

    await this.transitionStatus(orderId, OrderStatus.DRAFT, adminUserId);

    await prisma.approvalLog.create({
      data: {
        orderId,
        action: 'ADMIN_OVERRIDE',
        userId: adminUserId,
      },
    });
  }
}

export const workflowService = new WorkflowService();
