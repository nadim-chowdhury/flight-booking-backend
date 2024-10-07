import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Booking } from './booking.schema';

@Schema()
export class Passenger extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  passportNumber: string;

  // One-to-Many relationship with Booking (a passenger can have many bookings)
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Booking' }] })
  bookings: Booking[];
}

export const PassengerSchema = SchemaFactory.createForClass(Passenger);
