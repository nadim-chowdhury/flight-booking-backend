import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { Flight } from '../schemas/flight.schema';
import { SearchFlightDto } from './dto/search-flight.dto';

@Injectable()
export class FlightService {
  private readonly amadeusApiKey = process.env.AMADEUS_API_KEY;
  private readonly amadeusApiSecret = process.env.AMADEUS_API_SECRET;
  private readonly amadeusBaseUrl = 'https://test.api.amadeus.com/v2';
  private readonly amadeusBaseUrl2 = 'https://test.api.amadeus.com';

  constructor(
    @InjectModel(Flight.name) private readonly flightModel: Model<Flight>,
  ) {}

  // Get Amadeus Auth Token
  async getAmadeusAuthToken(): Promise<string> {
    const url = 'https://test.api.amadeus.com/v1/security/oauth2/token';
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', this.amadeusApiKey);
    params.append('client_secret', this.amadeusApiSecret);

    const response = await axios.post(url, params);
    return response.data.access_token;
  }

  // Fetch Airport Details with Retry Logic
  async fetchAirportDetails(iataCode: string): Promise<any> {
    try {
      const token = await this.getAmadeusAuthToken();
      const url = `${this.amadeusBaseUrl2}/v1/reference-data/locations?subType=AIRPORT&keyword=${iataCode}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/vnd.amadeus+json',
      };
      const response = await axios.get(url, { headers });

      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      } else {
        console.warn(`No airport data found for IATA code ${iataCode}`);
        return {
          name: 'Unknown Airport',
          address: { cityName: 'Unknown City' },
        };
      }
    } catch (error) {
      console.error(
        `Error fetching airport data for IATA code ${iataCode}:`,
        error.message,
      );
      return { name: 'Unknown Airport', address: { cityName: 'Unknown City' } };
    }
  }

  // Fetch Airline Details with Retry Logic
  async fetchAirlineDetails(carrierCode: string): Promise<any> {
    try {
      const token = await this.getAmadeusAuthToken();
      const url = `${this.amadeusBaseUrl2}/v1/reference-data/airlines?airlineCodes=${carrierCode}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/vnd.amadeus+json',
      };
      const response = await axios.get(url, { headers });

      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      } else {
        console.warn(`No airline data found for carrier code ${carrierCode}`);
        return { commonName: 'Unknown Airline' };
      }
    } catch (error) {
      console.error(
        `Error fetching airline data for carrier code ${carrierCode}:`,
        error.message,
      );
      return { commonName: 'Unknown Airline' };
    }
  }

  // Main search function based on flight type
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

    switch (type) {
      case 'one-way':
        return this.searchOneWayFlights(
          departureCity,
          destinationCity,
          departureDate,
          seatType,
          passengers,
        );
      case 'return-trip':
        return this.searchReturnTripFlights(
          departureCity,
          destinationCity,
          departureDate,
          returnDate,
          seatType,
          passengers,
        );
      case 'multi-city':
        return this.searchMultiCityFlights(flights, seatType, passengers);
      default:
        throw new NotFoundException('Invalid flight search type');
    }
  }

  // One-way flight search method
  async searchOneWayFlights(
    departureCity: string,
    destinationCity: string,
    departureDate: string,
    seatType: string,
    passengers: any,
  ): Promise<any> {
    try {
      const validSeatTypes = [
        'ECONOMY',
        'PREMIUM_ECONOMY',
        'BUSINESS',
        'FIRST',
      ];
      const formattedSeatType = seatType.toUpperCase();

      if (!validSeatTypes.includes(formattedSeatType)) {
        throw new NotFoundException('Invalid seat type');
      }

      const token = await this.getAmadeusAuthToken();
      const url = `${this.amadeusBaseUrl}/shopping/flight-offers`;
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/vnd.amadeus+json',
      };

      const body = {
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
          maxFlightOffers: 5,
          flightFilters: {
            cabinRestrictions: [
              {
                cabin: formattedSeatType,
                coverage: 'MOST_SEGMENTS',
                originDestinationIds: ['1'],
              },
            ],
          },
        },
      };

      // Log the request payload for debugging
      console.log(
        'Sending request to Amadeus with payload:',
        JSON.stringify(body, null, 2),
      );

      const response = await axios.post(url, body, { headers });

      // Check if response contains data and handle the case where no flights are returned
      if (
        !response.data ||
        !response.data.data ||
        response.data.data.length === 0
      ) {
        throw new NotFoundException('No flights found for the given criteria');
      }

      const flights = response.data.data;

      console.log('Amadeus API response:', flights);

      // Process the flights data (assuming a formatOneWayResponse function)
      return this.formatOneWayResponse(flights);
    } catch (error) {
      console.error(
        'Error during Amadeus API call:',
        error.response ? error.response.data : error.message,
      );
      throw new NotFoundException(
        'Error fetching flight data: ' + error.message,
      );
    }
  }

  // Search for return-trip flights
  async searchReturnTripFlights(
    departureCity: string,
    destinationCity: string,
    departureDate: string,
    returnDate: string,
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

      const body = {
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
          maxFlightOffers: 5,
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

      const response = await axios.post(url, body, { headers });
      const flights = response.data.data;

      if (!flights || flights.length === 0) {
        throw new NotFoundException('No flights found for the given criteria');
      }

      return flights; // Return real data
    } catch (error) {
      throw new NotFoundException(
        'Error fetching flight data: ' + error.message,
      );
    }
  }

  // Search for multi-city flights
  async searchMultiCityFlights(
    flights: {
      departureCity: string;
      destinationCity: string;
      departureDate: string;
    }[],
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

      const originDestinations = flights.map((flight, index) => ({
        id: (index + 1).toString(),
        originLocationCode: flight.departureCity,
        destinationLocationCode: flight.destinationCity,
        departureDateTimeRange: { date: flight.departureDate },
      }));

      const body = {
        currencyCode: 'USD',
        originDestinations,
        travelers: this.buildTravelers(passengers),
        sources: ['GDS'],
        searchCriteria: {
          maxFlightOffers: 5,
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

      const response = await axios.post(url, body, { headers });
      const flightsResponse = response.data.data;

      if (!flightsResponse || flightsResponse.length === 0) {
        throw new NotFoundException('No flights found for the given criteria');
      }

      return flightsResponse; // Return real data
    } catch (error) {
      throw new NotFoundException(
        'Error fetching flight data: ' + error.message,
      );
    }
  }

  // Helper to format Amadeus response to match your one-way demo format
  async formatOneWayResponse(flights: any): Promise<any> {
    return await Promise.all(
      flights.map(async (flight) => {
        const itineraries = await Promise.all(
          flight.itineraries.map(async (itinerary) => {
            return await Promise.all(
              itinerary.segments.map(async (segment) => {
                // Fetch departure airport details
                const departureAirport = await this.fetchAirportDetails(
                  segment.departure.iataCode,
                );

                // Fetch arrival airport details
                const arrivalAirport = await this.fetchAirportDetails(
                  segment.arrival.iataCode,
                );

                // Fetch airline details
                const airlineDetails = await this.fetchAirlineDetails(
                  segment.carrierCode,
                );

                // Construct the segment details
                return {
                  flightInformation: {
                    productDateTime: {
                      dateOfDeparture: segment.departure.at.slice(0, 10),
                      timeOfDeparture: segment.departure.at.slice(11, 16),
                      dateOfArrival: segment.arrival.at.slice(0, 10),
                      timeOfArrival: segment.arrival.at.slice(11, 16),
                      journeyTime: segment.duration,
                      segmentTime: this.formatDuration(segment.duration),
                    },
                    location: [
                      {
                        locationId: segment.departure.iataCode,
                        city:
                          departureAirport?.address?.cityName || 'Unknown City',
                        airportName:
                          departureAirport?.name || 'Unknown Airport',
                        terminal: segment.departure.terminal || '',
                      },
                      {
                        locationId: segment.arrival.iataCode,
                        city:
                          arrivalAirport?.address?.cityName || 'Unknown City',
                        airportName: arrivalAirport?.name || 'Unknown Airport',
                        terminal: segment.arrival.terminal || '',
                      },
                    ],
                    companyId: {
                      marketingCarrier:
                        airlineDetails?.commonName || segment.carrierCode,
                      operatingCarrier:
                        airlineDetails?.commonName || segment.carrierCode,
                    },
                    flightOrtrainNumber: segment.number,
                    productDetail: {
                      equipmentType: segment.aircraft?.code || 'N/A',
                    },
                    addProductDetail: {
                      cabinClass: segment.cabin,
                      availableSeats: segment.availableSeats || 'N/A',
                    },
                  },
                  technicalStop: [], // Assuming no technical stops for this response
                };
              }),
            );
          }),
        );

        // Pricing information for each traveler (adult, child, etc.)
        const travelerPricings = flight.travelerPricings.map((pricing) => ({
          travelerType: pricing.travelerType,
          fareAmount: pricing.price.total,
          baseFareAmount: pricing.price.base,
          taxAmount: pricing.price.grandTotal - pricing.price.base,
          fareDetails: pricing.fareDetailsBySegment.map((fareDetail) => ({
            cabinClass: fareDetail.cabin,
            fareBasis: fareDetail.fareBasis,
            availableSeats: fareDetail.classOfService || 'N/A',
          })),
        }));

        // Fare summary and breakdown
        const fareSummary = {
          breakdown: travelerPricings.reduce((acc, traveler) => {
            acc[traveler.travelerType] = {
              fareAmount: traveler.fareAmount,
              taxAmount: traveler.taxAmount,
              baseFareAmount: traveler.baseFareAmount,
              totalFareAmount: traveler.fareAmount,
              totalTaxAmount: traveler.taxAmount,
            };
            return acc;
          }, {}),
          refundable: flight.pricingOptions.refundAllowed || false,
          refundPenalty: flight.pricingOptions.penalty || 0,
          totalFareAmount: flight.price.grandTotal,
          totalTaxAmount: flight.price.grandTotal - flight.price.base,
        };

        // Return formatted flight combination and fare summary
        return {
          flightCombination: [
            {
              flightDetails: itineraries.flat(), // Flattening the array to avoid nested arrays
            },
          ],
          fareSummary: fareSummary,
          baggage: flight.pricingOptions.includedCheckedBagsOnly
            ? 'Included'
            : 'Not Included',
        };
      }),
    );
  }

  // Helper method to build travelers object
  buildTravelers(passengers: any) {
    const travelers = [];

    // Handle adults (travelerType: ADULT)
    for (let i = 0; i < parseInt(passengers.adults); i++) {
      travelers.push({ id: (i + 1).toString(), travelerType: 'ADULT' });
    }

    // Handle children (travelerType: CHILD, typically 2-11 years old)
    for (let i = 0; i < parseInt(passengers.children || 0); i++) {
      travelers.push({
        id: (i + 1 + travelers.length).toString(),
        travelerType: 'CHILD',
      });
    }

    // Handle infants without a seat (travelerType: INFANT, typically under 2 years old)
    for (let i = 0; i < parseInt(passengers.infants || 0); i++) {
      travelers.push({
        id: (i + 1 + travelers.length).toString(),
        travelerType: 'INFANT',
      });
    }

    // Handle infants with a seat (travelerType: HELD_INFANT, typically under 2 years old)
    for (let i = 0; i < parseInt(passengers.heldInfants || 0); i++) {
      travelers.push({
        id: (i + 1 + travelers.length).toString(),
        travelerType: 'HELD_INFANT',
      });
    }

    // Optionally, handle additional types if necessary (e.g., YOUNG, SENIOR, STUDENT, etc.)
    if (passengers.young) {
      for (let i = 0; i < parseInt(passengers.young || 0); i++) {
        travelers.push({
          id: (i + 1 + travelers.length).toString(),
          travelerType: 'YOUNG', // Optional travelerType for young travelers
        });
      }
    }

    if (passengers.senior) {
      for (let i = 0; i < parseInt(passengers.senior || 0); i++) {
        travelers.push({
          id: (i + 1 + travelers.length).toString(),
          travelerType: 'SENIOR', // Optional travelerType for senior travelers
        });
      }
    }

    return travelers;
  }

  // Helper to format duration (PTxxHxxM) to 'xx hours xx minutes'
  formatDuration(duration: string): string {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (!match) return duration;
    return `${match[1]} hours ${match[2]} minutes`;
  }
}
