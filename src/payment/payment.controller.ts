import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('process')
  @ApiOperation({ summary: 'Process payment' })
  @ApiBody({
    schema: {
      properties: {
        userId: { type: 'number' },
        bookingId: { type: 'number' },
        token: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Payment processed successfully' })
  async processPayment(
    @Body('userId') userId: number,
    @Body('bookingId') bookingId: number,
    @Body('token') token: string,
  ) {
    return this.paymentService.processPayment(userId, bookingId, token);
  }

  @Get('history/:userId')
  @ApiOperation({ summary: 'Get payment history by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment history retrieved successfully',
  })
  async getPaymentHistory(@Param('userId') userId: number) {
    return this.paymentService.getPaymentHistory(userId);
  }
}
