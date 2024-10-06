import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from 'src/entities/flight.entity';
import { SearchFlightDto } from './dto/search-flight.dto';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
  ) {}

  // Get all flights
  async getFlights(): Promise<Flight[]> {
    return this.flightRepository.find();
  }

  async searchFlights(searchFlightDto: SearchFlightDto): Promise<any> {
    const { type } = searchFlightDto;

    if (type === 'one-way') {
      return this.searchOnewayFlights(searchFlightDto);
    } else if (type === 'return-trip') {
      return this.searchReturnTripFlights(searchFlightDto);
    } else if (type === 'multi-city') {
      return this.searchMultiCityFlights(searchFlightDto);
    } else {
      throw new NotFoundException('Invalid flight search type');
    }
  }

  // Handle one way search
  async searchOnewayFlights(searchFlightDto: SearchFlightDto): Promise<any> {
    const {
      departureCity,
      destinationCity,
      departureDate,
      seatType,
      passengers,
    } = searchFlightDto;

    const flights = await this.flightRepository
      .createQueryBuilder('flight')
      .where('flight.from = :departureCity', { departureCity })
      .andWhere('flight.to = :destinationCity', { destinationCity })
      .andWhere('DATE(flight.departureTime) = :departureDate', {
        departureDate,
      })
      .andWhere('flight.cabinClass = :seatType', { seatType })
      .getMany();

    if (flights.length === 0) {
      throw new NotFoundException('No flights found for the given criteria');
    }

    // Format the response to match your expected output
    return {
      flightCombination: flights.map((flight) => ({
        flightDetails: [
          {
            flightInformation: {
              productDateTime: {
                dateOfDeparture: flight.departureTime
                  .toISOString()
                  .split('T')[0],
                timeOfDeparture: flight.departureTime
                  .toISOString()
                  .split('T')[1]
                  .slice(0, 5),
                dateOfArrival: flight.arrivalTime.toISOString().split('T')[0],
                timeOfArrival: flight.arrivalTime
                  .toISOString()
                  .split('T')[1]
                  .slice(0, 5),
                journeyTime:
                  (flight.arrivalTime.getTime() -
                    flight.departureTime.getTime()) /
                  (1000 * 60),
                segmentTime: `${Math.floor((flight.arrivalTime.getTime() - flight.departureTime.getTime()) / (1000 * 60 * 60))} hours ${Math.floor(((flight.arrivalTime.getTime() - flight.departureTime.getTime()) % (1000 * 60 * 60)) / (1000 * 60))} minutes`,
              },
              location: [
                {
                  locationId: flight.from,
                  terminal: flight.departure?.terminal || '',
                  city: flight.departure?.city || '',
                  cityCode: flight.from,
                  countryName: flight.departure?.country || '',
                  airportName: flight.departure?.airportName || '',
                },
                {
                  locationId: flight.to,
                  terminal: flight.arrival?.terminal || '',
                  city: flight.arrival?.city || '',
                  cityCode: flight.to,
                  countryName: flight.arrival?.country || '',
                  airportName: flight.arrival?.airportName || '',
                },
              ],
              companyId: {
                operatingCarrier: flight.airline,
                marketingCarrier: flight.airline,
                marketingCarrierCode: flight.airline || 'XX',
                operatingCarrierCode: flight.airline || 'XX',
              },
              flightOrtrainNumber: flight.flightNumber,
              productDetail: {
                equipmentType: flight.equipmentType,
              },
              addProductDetail: {
                electronicTicketing: flight.electronicTicketing || 'Yes',
                cabinClass: flight.cabinClass,
                availableSeats: flight.availableSeats,
                fareClass: flight.fareBasis,
                techstop: flight.techstop || '',
              },
            },
            technicalStop: flight.techstop
              ? [
                  {
                    stopDetails: [
                      {
                        date: flight.departureTime.toISOString().split('T')[0],
                        firstTime: flight.departureTime
                          .toISOString()
                          .split('T')[1]
                          .slice(0, 5),
                        locationId: 'TechStop Airport',
                      },
                    ],
                  },
                ]
              : [],
          },
        ],
      })),
      fareSummary: {
        totalFareAmount: flights.reduce((sum, flight) => sum + flight.price, 0),
        passengers: {
          adults: passengers.adults,
          children: passengers.children || '0',
          infants: passengers.infants || '0',
        },
      },
    };
  }

  // Handle return trip search
  async searchReturnTripFlights(
    searchFlightDto: SearchFlightDto,
  ): Promise<any> {
    const {
      departureCity,
      destinationCity,
      departureDate,
      returnDate,
      seatType,
      passengers,
    } = searchFlightDto;

    const outboundFlights = await this.flightRepository
      .createQueryBuilder('flight')
      .where('flight.from = :departureCity', { departureCity })
      .andWhere('flight.to = :destinationCity', { destinationCity })
      .andWhere('DATE(flight.departureTime) = :departureDate', {
        departureDate,
      })
      .andWhere('flight.cabinClass = :seatType', { seatType })
      .getMany();

    const returnFlights = await this.flightRepository
      .createQueryBuilder('flight')
      .where('flight.from = :destinationCity', { destinationCity })
      .andWhere('flight.to = :departureCity', { departureCity })
      .andWhere('DATE(flight.departureTime) = :returnDate', { returnDate })
      .andWhere('flight.cabinClass = :seatType', { seatType })
      .getMany();

    if (outboundFlights.length === 0 || returnFlights.length === 0) {
      throw new NotFoundException('No flights found for the given criteria');
    }

    // Format the response
    return {
      flightCombination: [
        ...outboundFlights.map((flight) => ({
          flightDetails: [
            {
              flightInformation: {
                productDateTime: {
                  dateOfDeparture: flight.departureTime
                    .toISOString()
                    .split('T')[0],
                  timeOfDeparture: flight.departureTime
                    .toISOString()
                    .split('T')[1]
                    .slice(0, 5),
                  dateOfArrival: flight.arrivalTime.toISOString().split('T')[0],
                  timeOfArrival: flight.arrivalTime
                    .toISOString()
                    .split('T')[1]
                    .slice(0, 5),
                  journeyTime:
                    (flight.arrivalTime.getTime() -
                      flight.departureTime.getTime()) /
                    (1000 * 60), // In minutes
                  segmentTime: `${Math.floor((flight.arrivalTime.getTime() - flight.departureTime.getTime()) / (1000 * 60 * 60))} hours ${Math.floor(((flight.arrivalTime.getTime() - flight.departureTime.getTime()) % (1000 * 60 * 60)) / (1000 * 60))} minutes`,
                },
                location: [
                  {
                    locationId: flight.from,
                    terminal: flight.departure?.terminal || '',
                    city: flight.departure?.city || '',
                    cityCode: flight.from,
                    countryName: flight.departure?.country || '',
                    airportName: flight.departure?.airportName || '',
                  },
                  {
                    locationId: flight.to,
                    terminal: flight.arrival?.terminal || '',
                    city: flight.arrival?.city || '',
                    cityCode: flight.to,
                    countryName: flight.arrival?.country || '',
                    airportName: flight.arrival?.airportName || '',
                  },
                ],
                companyId: {
                  operatingCarrier: flight.airline,
                  marketingCarrier: flight.airline,
                  marketingCarrierCode: flight.airline || 'XX',
                  operatingCarrierCode: flight.airline || 'XX',
                },
                flightOrtrainNumber: flight.flightNumber,
                productDetail: {
                  equipmentType: flight.equipmentType,
                },
                addProductDetail: {
                  electronicTicketing: flight.electronicTicketing || 'Yes',
                  cabinClass: flight.cabinClass,
                  availableSeats: flight.availableSeats,
                  fareClass: flight.fareBasis,
                  techstop: flight.techstop || '',
                },
              },
              technicalStop: flight.techstop
                ? [
                    {
                      stopDetails: [
                        {
                          date: flight.departureTime
                            .toISOString()
                            .split('T')[0],
                          firstTime: flight.departureTime
                            .toISOString()
                            .split('T')[1]
                            .slice(0, 5),
                          locationId: 'TechStop Airport',
                        },
                      ],
                    },
                  ]
                : [],
            },
          ],
        })),
        ...returnFlights.map((flight) => ({
          flightDetails: [
            {
              flightInformation: {
                productDateTime: {
                  dateOfDeparture: flight.departureTime
                    .toISOString()
                    .split('T')[0],
                  timeOfDeparture: flight.departureTime
                    .toISOString()
                    .split('T')[1]
                    .slice(0, 5),
                  dateOfArrival: flight.arrivalTime.toISOString().split('T')[0],
                  timeOfArrival: flight.arrivalTime
                    .toISOString()
                    .split('T')[1]
                    .slice(0, 5),
                  journeyTime:
                    (flight.arrivalTime.getTime() -
                      flight.departureTime.getTime()) /
                    (1000 * 60), // In minutes
                  segmentTime: `${Math.floor((flight.arrivalTime.getTime() - flight.departureTime.getTime()) / (1000 * 60 * 60))} hours ${Math.floor(((flight.arrivalTime.getTime() - flight.departureTime.getTime()) % (1000 * 60 * 60)) / (1000 * 60))} minutes`,
                },
                location: [
                  {
                    locationId: flight.from,
                    terminal: flight.departure?.terminal || '',
                    city: flight.departure?.city || '',
                    cityCode: flight.from,
                    countryName: flight.departure?.country || '',
                    airportName: flight.departure?.airportName || '',
                  },
                  {
                    locationId: flight.to,
                    terminal: flight.arrival?.terminal || '',
                    city: flight.arrival?.city || '',
                    cityCode: flight.to,
                    countryName: flight.arrival?.country || '',
                    airportName: flight.arrival?.airportName || '',
                  },
                ],
                companyId: {
                  operatingCarrier: flight.airline,
                  marketingCarrier: flight.airline,
                  marketingCarrierCode: flight.airline || 'XX',
                  operatingCarrierCode: flight.airline || 'XX',
                },
                flightOrtrainNumber: flight.flightNumber,
                productDetail: {
                  equipmentType: flight.equipmentType,
                },
                addProductDetail: {
                  electronicTicketing: flight.electronicTicketing || 'Yes',
                  cabinClass: flight.cabinClass,
                  availableSeats: flight.availableSeats,
                  fareClass: flight.fareBasis,
                  techstop: flight.techstop || '',
                },
              },
              technicalStop: flight.techstop
                ? [
                    {
                      stopDetails: [
                        {
                          date: flight.departureTime
                            .toISOString()
                            .split('T')[0],
                          firstTime: flight.departureTime
                            .toISOString()
                            .split('T')[1]
                            .slice(0, 5),
                          locationId: 'TechStop Airport',
                        },
                      ],
                    },
                  ]
                : [],
            },
          ],
        })),
      ],
      fareSummary: {
        totalFareAmount:
          outboundFlights.reduce((sum, flight) => sum + flight.price, 0) +
          returnFlights.reduce((sum, flight) => sum + flight.price, 0),
        passengers: {
          adults: passengers.adults,
          children: passengers.children || '0',
          infants: passengers.infants || '0',
        },
      },
    };
  }

  // Handle multi city search
  async searchMultiCityFlights(searchFlightDto: SearchFlightDto): Promise<any> {
    const { flights, seatType, passengers } = searchFlightDto;

    const results = await Promise.all(
      flights.map(async (flightSegment) => {
        const { departureCity, destinationCity, departureDate } = flightSegment;
        const matchingFlights = await this.flightRepository
          .createQueryBuilder('flight')
          .where('flight.from = :departureCity', { departureCity })
          .andWhere('flight.to = :destinationCity', { destinationCity })
          .andWhere('DATE(flight.departureTime) = :departureDate', {
            departureDate,
          })
          .andWhere('flight.cabinClass = :seatType', { seatType })
          .getMany();

        if (matchingFlights.length === 0) {
          throw new NotFoundException(
            `No flights found for segment from ${departureCity} to ${destinationCity} on ${departureDate}`,
          );
        }

        return matchingFlights.map((flight) => ({
          flightInformation: {
            productDateTime: {
              dateOfDeparture: flight.departureTime.toISOString().split('T')[0],
              timeOfDeparture: flight.departureTime
                .toISOString()
                .split('T')[1]
                .slice(0, 5),
              dateOfArrival: flight.arrivalTime.toISOString().split('T')[0],
              timeOfArrival: flight.arrivalTime
                .toISOString()
                .split('T')[1]
                .slice(0, 5),
              journeyTime:
                (flight.arrivalTime.getTime() -
                  flight.departureTime.getTime()) /
                (1000 * 60), // In minutes
              segmentTime: `${Math.floor(
                (flight.arrivalTime.getTime() -
                  flight.departureTime.getTime()) /
                  (1000 * 60 * 60),
              )} hours ${Math.floor(
                ((flight.arrivalTime.getTime() -
                  flight.departureTime.getTime()) %
                  (1000 * 60 * 60)) /
                  (1000 * 60),
              )} minutes`,
            },
            location: [
              {
                locationId: flight.from,
                terminal: flight.departure?.terminal || '',
                city: flight.departure?.city || '',
                cityCode: flight.from,
                countryName: flight.departure?.country || '',
                airportName: flight.departure?.airportName || '',
              },
              {
                locationId: flight.to,
                terminal: flight.arrival?.terminal || '',
                city: flight.arrival?.city || '',
                cityCode: flight.to,
                countryName: flight.arrival?.country || '',
                airportName: flight.arrival?.airportName || '',
              },
            ],
            companyId: {
              operatingCarrier: flight.airline,
              marketingCarrier: flight.airline,
              marketingCarrierCode: flight.airline || 'XX',
              operatingCarrierCode: flight.airline || 'XX',
            },
            flightOrtrainNumber: flight.flightNumber,
            productDetail: {
              equipmentType: flight.equipmentType,
            },
            addProductDetail: {
              electronicTicketing: flight.electronicTicketing || 'Yes',
              cabinClass: flight.cabinClass,
              availableSeats: flight.availableSeats,
              fareClass: flight.fareBasis,
              techstop: flight.techstop || '',
            },
          },
          technicalStop: flight.techstop
            ? [
                {
                  stopDetails: [
                    {
                      date: flight.departureTime.toISOString().split('T')[0],
                      firstTime: flight.departureTime
                        .toISOString()
                        .split('T')[1]
                        .slice(0, 5),
                      locationId: 'TechStop Airport',
                    },
                  ],
                },
              ]
            : [],
          // Access the price correctly from flight entity
          price: flight.price,
        }));
      }),
    );

    // Flatten the results and return the final response
    return {
      flightCombination: results.flat(),
      fareSummary: {
        totalFareAmount: results.flat().reduce((sum, segment) => {
          return sum + (segment.price || 0); // Access `price` directly from the flight object
        }, 0),
        passengers: {
          adults: passengers.adults,
          children: passengers.children || '0',
          infants: passengers.infants || '0',
        },
      },
    };
  }

  // Get flight by ID
  async getFlightById(id: number): Promise<Flight> {
    const flight = await this.flightRepository.findOne({ where: { id } });
    if (!flight) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
    return flight;
  }

  // Create a new flight using CreateFlightDto
  // async createFlight(createFlightDto: CreateFlightDto): Promise<Flight> {
  //   const flight = this.flightRepository.create(createFlightDto);
  //   return this.flightRepository.save(flight);
  // }
  async createFlight(createFlightDto: CreateFlightDto): Promise<Flight> {
    // Ensure the airline field is not null or undefined
    // if (!createFlightDto.airline) {
    //   throw new BadRequestException('Airline must be provided');
    // }

    const flight = this.flightRepository.create({
      // ...createFlightDto,
      // airline: createFlightDto.airline, // Ensure this is set correctly
    });

    return this.flightRepository.save(flight);
  }

  // Update flight details
  async updateFlight(
    id: number,
    updateFlightDto: UpdateFlightDto,
  ): Promise<Flight> {
    const flight = await this.flightRepository.preload({
      id,
      ...updateFlightDto,
    });

    if (!flight) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }

    return this.flightRepository.save(flight);
  }

  // Delete a flight
  async deleteFlight(id: number): Promise<void> {
    const result = await this.flightRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
  }
}
