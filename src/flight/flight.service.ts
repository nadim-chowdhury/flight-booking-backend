import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { Flight } from '../schemas/flight.schema';
import { SearchFlightDto } from './dto/search-flight.dto';
import { AmadeusService } from 'src/amadeus/amadeus.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { BookFlight } from 'src/schemas/book-flight.schema';
import { JwtService } from '@nestjs/jwt';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Injectable()
export class FlightService {
  private readonly amadeusApiKey = process.env.AMADEUS_API_KEY;
  private readonly amadeusApiSecret = process.env.AMADEUS_API_SECRET;
  private readonly amadeusBaseUrl = 'https://test.api.amadeus.com/v2';
  private readonly amadeusBaseUrl2 = 'https://test.api.amadeus.com/v1';

  // Caching mechanism to store fetched data temporarily during search
  private airportCache = new Map<string, any>();
  private airlineCache = new Map<string, any>();
  private planeCache = new Map<string, any>();

  constructor(
    @InjectModel(Flight.name) private readonly flightModel: Model<Flight>,
    @InjectModel(BookFlight.name)
    private readonly flightBookModel: Model<BookFlight>, // Ensure this is properly injected
    private readonly amadeusService: AmadeusService,
    private readonly jwtService: JwtService,
  ) {}

  // Save flight data to MongoDB
  async createFlight(
    createFlightDto: CreateFlightDto,
    userId: string,
  ): Promise<BookFlight> {
    const {
      flightCombination,
      fareSummary,
      baggage,
      validatingCarrier,
      finalFare,
      flightSummary,
      totalJourneyTime,
    } = createFlightDto;

    const firstFlightDetail =
      flightCombination[0]?.flightDetails?.[0]?.flightInformation || {};
    const lastFlightDetail =
      flightCombination[0]?.flightDetails?.slice(-1)[0]?.flightInformation ||
      {};

    const from = firstFlightDetail?.location[0]?.locationId || 'Unknown';
    const to =
      lastFlightDetail?.location?.slice(-1)[0]?.locationId || 'Unknown';
    const airline =
      validatingCarrier ||
      firstFlightDetail?.companyId?.marketingCarrierCode ||
      'Unknown';
    const departureTime =
      firstFlightDetail?.productDateTime?.timeOfDeparture || 'Unknown';
    const arrivalTime =
      lastFlightDetail?.productDateTime?.timeOfArrival || 'Unknown';
    const duration = totalJourneyTime || 0;
    const price = parseFloat(finalFare) || 0;
    const availableSeats =
      firstFlightDetail?.addProductDetail?.availableSeats || 'N/A';

    // Creating the flight document with userId
    const createdFlight = new this.flightBookModel({
      flightCombination,
      fareSummary,
      baggage,
      validatingCarrier,
      finalFare,
      flightSummary,
      totalJourneyTime,
      from,
      to,
      airline,
      departureTime,
      arrivalTime,
      duration,
      price,
      availableSeats,
      userId, // Save the userId to link the booking to the user
    });

    // return await createdFlight.save();

    // Save the created flight document
    const savedFlight = await createdFlight.save();

    // Return the saved flight data including the _id
    return savedFlight;
  }

  // Get all flights based on user role (Admin sees all, users see only their bookings)
  async getAllFlights(accessToken: string): Promise<BookFlight[]> {
    const decodedToken = this.jwtService.decode(accessToken) as any;
    console.log('getAllFlights ~ decodedToken:', decodedToken);
    const userId = decodedToken?.sub;
    console.log('getAllFlights ~ userId:', userId);
    const role = decodedToken?.roles[0];
    console.log('getAllFlights ~ role:', role);

    if (!userId) {
      throw new ForbiddenException('Invalid access token.');
    }

    // If the user is an admin, return all flight bookings sorted by creation date (latest first)
    if (role === 'admin') {
      return this.flightBookModel.find().sort({ createdAt: -1 }).exec();
    }

    // Otherwise, return only the bookings for the current user, sorted by creation date (latest first)
    return this.flightBookModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  // Get flight data by ID
  async getFlightById(id: string): Promise<BookFlight> {
    // Use Mongoose `findById` to find the flight by ID and check if it exists
    const flight = await this.flightBookModel.findById(id).exec();

    // If no flight is found, throw a `NotFoundException` with the flight ID
    if (!flight) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }

    // Return the flight if it is found
    return flight;
  }

  // Update flight data by ID using findByIdAndUpdate
  async updateFlightById(
    id: string,
    updateFlightDto: UpdateFlightDto,
  ): Promise<BookFlight> {
    // `findByIdAndUpdate` finds a document by ID and applies the update
    const updatedFlight = await this.flightBookModel
      .findByIdAndUpdate(
        id,
        { $set: updateFlightDto }, // Only update the specified fields
        { new: true, runValidators: true },
      )
      .exec();

    // If no flight is found, throw a `NotFoundException` with the flight ID
    if (!updatedFlight) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }

    // Return the updated flight
    return updatedFlight;
  }

  // Get Amadeus Auth Token
  async getAmadeusAuthToken(): Promise<string> {
    const url = 'https://test.api.amadeus.com/v1/security/oauth2/token';
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', this.amadeusApiKey);
    params.append('client_secret', this.amadeusApiSecret);

    const response = await axios.post(url, params);
    // console.log('getAmadeusAuthToken ~ response:', response);
    return response.data.access_token;
  }

  // Build body for one-way flight search
  private buildOneWaySearchBody(
    departureCity: string,
    destinationCity: string,
    departureDate: string,
    seatType: string,
    passengers: any,
  ) {
    return {
      currencyCode: 'USD',
      originDestinations: [
        {
          id: '1',
          originLocationCode: departureCity,
          destinationLocationCode: destinationCity,
          departureDateTimeRange: { date: departureDate },
        },
      ],
      travelers: this.buildTravelers(passengers),
      sources: ['GDS'],
      searchCriteria: {
        maxFlightOffers: 10,
        flightFilters: {
          cabinRestrictions: [
            {
              cabin: seatType.toUpperCase(),
              coverage: 'MOST_SEGMENTS',
              originDestinationIds: ['1'],
            },
          ],
        },
      },
    };
  }

  // Build body for return-trip flight search
  private buildReturnTripSearchBody(
    departureCity: string,
    destinationCity: string,
    departureDate: string,
    returnDate: string,
    seatType: string,
    passengers: any,
  ) {
    return {
      currencyCode: 'USD',
      originDestinations: [
        {
          id: '1',
          originLocationCode: departureCity,
          destinationLocationCode: destinationCity,
          departureDateTimeRange: { date: departureDate },
        },
        {
          id: '2',
          originLocationCode: destinationCity,
          destinationLocationCode: departureCity,
          departureDateTimeRange: { date: returnDate },
        },
      ],
      travelers: this.buildTravelers(passengers),
      sources: ['GDS'],
      searchCriteria: {
        maxFlightOffers: 10,
        flightFilters: {
          cabinRestrictions: [
            {
              cabin: seatType.toUpperCase(),
              coverage: 'MOST_SEGMENTS',
              originDestinationIds: ['1', '2'],
            },
          ],
        },
      },
    };
  }

  // Build body for multi-city flight search
  private buildMultiCitySearchBody(
    flights: {
      departureCity: string;
      destinationCity: string;
      departureDate: string;
    }[],
    seatType: string,
    passengers: any,
  ) {
    const originDestinations = flights.map((flight, index) => ({
      id: (index + 1).toString(),
      originLocationCode: flight.departureCity,
      destinationLocationCode: flight.destinationCity,
      departureDateTimeRange: { date: flight.departureDate },
    }));

    return {
      currencyCode: 'USD',
      originDestinations,
      travelers: this.buildTravelers(passengers),
      sources: ['GDS'],
      searchCriteria: {
        maxFlightOffers: 10,
        flightFilters: {
          cabinRestrictions: [
            {
              cabin: seatType.toUpperCase(),
              coverage: 'MOST_SEGMENTS',
              originDestinationIds: originDestinations.map((_, index) =>
                (index + 1).toString(),
              ),
            },
          ],
        },
      },
    };
  }

  // Search Flights based on type (one-way, return-trip, multi-city)
  async searchFlights(searchFlightDto: SearchFlightDto): Promise<any> {
    const {
      type,
      departureCity,
      destinationCity,
      departureDate,
      returnDate,
      seatType,
      passengers,
      flights,
    } = searchFlightDto;

    const token = await this.getAmadeusAuthToken();
    const url = `${this.amadeusBaseUrl}/shopping/flight-offers`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/vnd.amadeus+json',
    };

    let body = {};

    switch (type) {
      case 'one-way':
        body = this.buildOneWaySearchBody(
          departureCity,
          destinationCity,
          departureDate,
          seatType,
          passengers,
        );
        break;
      case 'return-trip':
        body = this.buildReturnTripSearchBody(
          departureCity,
          destinationCity,
          departureDate,
          returnDate,
          seatType,
          passengers,
        );
        break;
      case 'multi-city':
        body = this.buildMultiCitySearchBody(flights, seatType, passengers);
        break;
      default:
        throw new NotFoundException('Invalid flight search type');
    }

    try {
      console.log(
        'Request body sent to Amadeus API:',
        JSON.stringify(body, null, 2),
      );

      const response = await axios.post(url, body, { headers });
      console.log('searchFlights ~ body:', body);
      console.log('searchFlights ~ response:', response.data);

      if (
        !response.data ||
        !response.data.data ||
        response.data.data.length === 0
      ) {
        throw new NotFoundException('No flights found for the given criteria');
      }

      // Return the raw response data from Amadeus API without formatting
      return response.data;
    } catch (error) {
      console.error(
        'Error during Amadeus API call:',
        error.response ? JSON.stringify(error.response.data) : error.message,
      );
      throw new NotFoundException(
        'Error fetching flight data: ' + error.message,
      );
    }
  }

  // Build travelers array from passengers
  private buildTravelers(passengers: any) {
    const travelers = [];
    const types = ['adults', 'children', 'infants'];
    const travelerTypes = {
      adults: 'ADULT',
      children: 'CHILD',
      infants: 'INFANT',
    };

    types.forEach((type) => {
      for (let i = 0; i < parseInt(passengers[type] || 0); i++) {
        travelers.push({
          id: (travelers.length + 1).toString(),
          travelerType: travelerTypes[type],
        });
      }
    });

    return travelers;
  }

  // Calculate total journey time for multi-city trips
  calculateTotalJourneyTimeForMultiCity(itineraries: any[]): number {
    return itineraries.reduce((totalTime, itinerary) => {
      const journeyTime = this.calculateTotalJourneyTime(itinerary.duration);
      return totalTime + journeyTime;
    }, 0);
  }

  // Calculate date variation if the arrival date is different from the departure date
  calculateDateVariation(
    departureDateTime: string,
    arrivalDateTime: string,
  ): string {
    const departureDate = new Date(departureDateTime);
    const arrivalDate = new Date(arrivalDateTime);
    const differenceInDays =
      (arrivalDate.getTime() - departureDate.getTime()) / (1000 * 3600 * 24);
    return differenceInDays > 0 ? differenceInDays.toString() : '0';
  }

  // Format duration from PT format to 'hours minutes'
  formatDuration(duration: string): string {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (!match) return duration;
    return `${match[1]} hours ${match[2]} minutes`;
  }

  // Build fare summary
  buildFareSummary(amadeusFlightOffer: any): any {
    const breakdown = {};
    amadeusFlightOffer.travelerPricings.forEach((pricing) => {
      const travelerType =
        pricing.travelerType === 'CHILD'
          ? 'CH'
          : pricing.travelerType === 'INFANT'
            ? 'INF'
            : 'ADT';
      if (!breakdown[travelerType]) {
        breakdown[travelerType] = {
          fareAmount: 0,
          taxAmount: 0,
          baseFareAmount: 0,
          paxCount: 0,
        };
      }
      breakdown[travelerType].fareAmount += parseFloat(pricing.price.total);
      breakdown[travelerType].baseFareAmount += parseFloat(pricing.price.base);
      breakdown[travelerType].paxCount++;
    });

    return {
      breakdown,
      refundable: amadeusFlightOffer.pricingOptions.refundable || false,
      totalFareAmount: amadeusFlightOffer.price.total,
      totalTaxAmount:
        amadeusFlightOffer.price.total - amadeusFlightOffer.price.base,
      totalBaseFareAmount: amadeusFlightOffer.price.base,
    };
  }

  // Build baggage details
  buildBaggageDetails(travelerPricings: any): any {
    return travelerPricings.map((pricing) => {
      return {
        travelerType: pricing.travelerType,
        freeAllowance:
          pricing.fareDetailsBySegment[0]?.includedCheckedBags?.weight || 'N/A',
        cabinBaggage: '7 Kg(s)',
      };
    });
  }

  // Build flight summary
  buildFlightSummary(amadeusFlightOffer: any): any {
    return amadeusFlightOffer.itineraries.map((itinerary) => ({
      fromCode: itinerary.segments[0].departure.iataCode,
      toCode:
        itinerary.segments[itinerary.segments.length - 1].arrival.iataCode,
      segmentTime: this.calculateTotalJourneyTime(itinerary.duration),
    }));
  }

  // Calculate total journey time in minutes from the Amadeus "PT" formatted duration
  calculateTotalJourneyTime(duration: string): number {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (!match) return 0;
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    return hours * 60 + minutes;
  }
}
