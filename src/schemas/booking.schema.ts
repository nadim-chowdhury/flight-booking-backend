import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Flight } from './flight.schema';
import { Passenger } from './passenger.schema';

@Schema()
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Flight', required: true })
  flight: Flight;

  @Prop({ type: Types.ObjectId, ref: 'Passenger', required: true })
  passenger: Passenger;

  @Prop({ required: true })
  bookingDate: Date;

  @Prop({ required: true })
  numberOfSeats: number;

  @Prop({ required: true, type: 'decimal128' })
  totalPrice: number;

  @Prop({ required: true })
  status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
