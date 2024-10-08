import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Passenger extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true })
  passportNumber: string;

  @Prop({ required: true })
  passportExpiry: Date;

  @Prop({ unique: true })
  passengerId: string; // Unique ID for identifying the passenger
}

export const PassengerSchema = SchemaFactory.createForClass(Passenger);
