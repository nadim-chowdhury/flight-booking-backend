import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { Flight } from '../schemas/flight.schema';
import { SearchFlightDto } from './dto/search-flight.dto';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Injectable()
export class FlightService {
  private readonly amadeusApiKey = process.env.AMADEUS_API_KEY; // Ensure your Amadeus API key is set in your environment
  private readonly amadeusApiSecret = process.env.AMADEUS_API_SECRET; // Amadeus API secret
  private readonly amadeusBaseUrl = 'https://test.api.amadeus.com/v2';

  constructor(
    @InjectModel(Flight.name) private readonly flightModel: Model<Flight>,
  ) {}

  // Authenticate and get a bearer token for Amadeus API
  async getAmadeusAuthToken(): Promise<string> {
    const url = 'https://test.api.amadeus.com/v1/security/oauth2/token';
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', this.amadeusApiKey);
    params.append('client_secret', this.amadeusApiSecret);

    const response = await axios.post(url, params);
    return response.data.access_token;
  }

  // Search for flights based on criteria using Amadeus API
  async searchFlights(searchFlightDto: SearchFlightDto): Promise<any> {
    const {
      type,
      departureCity,
      destinationCity,
      departureDate,
      seatType,
      passengers,
    } = searchFlightDto;

    if (type === 'one-way') {
      return this.searchOneWayFlights(
        departureCity,
        destinationCity,
        departureDate,
        seatType,
        passengers,
      );
    }

    throw new NotFoundException('Invalid flight search type');
  }

  // Search one-way flights using Amadeus API
  async searchOneWayFlights(
    departureCity: string,
    destinationCity: string,
    departureDate: string,
    seatType: string,
    passengers: any,
  ): Promise<any> {
    try {
      const token = await this.getAmadeusAuthToken();

      const url = `${this.amadeusBaseUrl}/shopping/flight-offers`;
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/vnd.amadeus+json',
      };

      // Prepare the request body for Amadeus flight search
      const body = {
        currencyCode: 'USD',
        originDestinations: [
          {
            id: '1',
            originLocationCode: departureCity,
            destinationLocationCode: destinationCity,
            departureDateTimeRange: {
              date: departureDate,
            },
          },
        ],
        travelers: this.buildTravelers(passengers),
        sources: ['GDS'],
        searchCriteria: {
          maxFlightOffers: 5,
          flightFilters: {
            cabinRestrictions: [
              {
                cabin: seatType.toUpperCase(), // e.g. "BUSINESS"
                coverage: 'MOST_SEGMENTS',
                originDestinationIds: ['1'],
              },
            ],
          },
        },
      };

      const response = await axios.post(url, body, { headers });
      const flights = response.data.data;

      if (!flights || flights.length === 0) {
        throw new NotFoundException('No flights found for the given criteria');
      }

      return this.formatFlightResponse(flights, passengers);
    } catch (error) {
      throw new NotFoundException(
        'Error fetching flight data from Amadeus API: ' + error.message,
      );
    }
  }

  // Helper to build travelers object for Amadeus API
  buildTravelers(passengers: any) {
    const travelers = [];

    for (let i = 0; i < parseInt(passengers.adults); i++) {
      travelers.push({ id: (i + 1).toString(), travelerType: 'ADULT' });
    }

    for (let i = 0; i < parseInt(passengers.children || 0); i++) {
      travelers.push({
        id: (i + 1 + travelers.length).toString(),
        travelerType: 'CHILD',
      });
    }

    for (let i = 0; i < parseInt(passengers.infants || 0); i++) {
      travelers.push({
        id: (i + 1 + travelers.length).toString(),
        travelerType: 'INFANT',
      });
    }

    return travelers;
  }

  // Format the flight response from Amadeus API to match frontend expectations
  formatFlightResponse(flights: any[], passengers: any) {
    return flights.map((flight) => ({
      flightDetails: {
        flightInformation: flight.itineraries.map((itinerary) => ({
          productDateTime: {
            dateOfDeparture: itinerary.segments[0].departure.at.split('T')[0],
            timeOfDeparture: itinerary.segments[0].departure.at.split('T')[1],
            dateOfArrival:
              itinerary.segments[
                itinerary.segments.length - 1
              ].arrival.at.split('T')[0],
            timeOfArrival:
              itinerary.segments[
                itinerary.segments.length - 1
              ].arrival.at.split('T')[1],
            journeyTime: itinerary.duration, // E.g., PT9H10M
          },
          location: itinerary.segments.map((segment) => ({
            locationId: segment.departure.iataCode,
            city: '', // Amadeus API may not provide city directly
            airportName: '', // Amadeus API may not provide airport name directly
          })),
          // companyId: {
          //   operatingCarrier: segment.carrierCode,
          //   marketingCarrier: segment.carrierCode,
          // },
          // flightOrtrainNumber: segment.number,
          // productDetail: {
          //   equipmentType: segment.aircraft.code,
          // },
          // addProductDetail: {
          //   cabinClass: segment.cabin, // Comes directly from Amadeus API
          // },
        })),
      },
      fareSummary: {
        totalFareAmount: flight.price.total,
        passengers: {
          adults: passengers.adults,
          children: passengers.children || '0',
          infants: passengers.infants || '0',
        },
      },
    }));
  }
}
