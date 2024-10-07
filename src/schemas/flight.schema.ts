import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Booking } from './booking.schema';

@Schema()
export class Flight extends Document {
  @Prop({ required: true })
  airline: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  availableSeats: number;

  @Prop({ required: true })
  departureTime: Date;

  @Prop({ required: true })
  arrivalTime: Date;

  @Prop({ required: true, type: 'decimal' })
  price: number;

  @Prop({ required: true })
  duration: string;

  @Prop({ nullable: true })
  flightNumber: string;

  @Prop({ nullable: true })
  equipmentType: string;

  @Prop({ nullable: true })
  electronicTicketing: string;

  @Prop({ nullable: true })
  cabinClass: string;

  @Prop({ nullable: true })
  fareBasis: string;

  @Prop({ nullable: true })
  techstop: string;

  // New fields for detailed departure information
  @Prop({
    type: Object,
    nullable: true,
    default: {},
  })
  departure: {
    airportName: string;
    city: string;
    country: string;
    terminal?: string;
  };

  // New fields for detailed arrival information
  @Prop({
    type: Object,
    nullable: true,
    default: {},
  })
  arrival: {
    airportName: string;
    city: string;
    country: string;
    terminal?: string;
  };

  // One-to-Many relationship with Booking (a flight can have many bookings)
  @Prop({ type: [{ type: Object, ref: 'Booking' }] })
  bookings: Booking[];
}

export const FlightSchema = SchemaFactory.createForClass(Flight);
