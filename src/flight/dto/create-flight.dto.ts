export class CreateFlightDto {
  airline: string;
  departure: string;
  arrival: string;
  departureTime: Date;
  arrivalTime: Date;
  price: number;
  availability: number;
}
