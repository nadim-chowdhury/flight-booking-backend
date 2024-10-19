import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs'; // Import for converting Observable to Promise

@Injectable()
export class AmadeusService {
  private clientId: string;
  private clientSecret: string;
  private tokenUrl: string;
  private apiBaseUrl: string;

  constructor(
    private readonly httpService: HttpService, // Now using HttpService from @nestjs/axios
    private readonly configService: ConfigService,
  ) {
    this.clientId = this.configService.get<string>('AMADEUS_API_KEY');
    this.clientSecret = this.configService.get<string>('AMADEUS_API_SECRET');
    this.tokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
    this.apiBaseUrl = 'https://test.api.amadeus.com/v1';
  }

  // Fetch the access token from Amadeus API
  private async getAccessToken(): Promise<string> {
    const payload = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.tokenUrl, payload.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );

      return response.data.access_token;
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve access token: ${error.message}`,
        error.response?.status || 500,
      );
    }
  }

  // Fetch airport data from Amadeus API based on a search keyword
  async searchAirports(keyword: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    const url = `${this.apiBaseUrl}/reference-data/locations?subType=CITY,AIRPORT&keyword=${keyword}&page%5Blimit%5D=10`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch airport data: ${error.message}`,
        error.response?.status || 500,
      );
    }
  }

  // Fetch airport data from Amadeus API based on a search keyword
  async searchAllAirports(keyword: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    const url = `${this.apiBaseUrl}/reference-data/locations?subType=CITY,AIRPORT&keyword=${keyword}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch airport data: ${error.message}`,
        error.response?.status || 500,
      );
    }
  }

  // Fetch airport details based on IATA code (for CITY or AIRPORT subType)
  async getAirportDetails(iataCode: string): Promise<any> {
    // const accessToken = await this.getAccessToken();
    // const url = `${this.apiBaseUrl}/reference-data/locations?subType=CITY,AIRPORT&keyword=${iataCode}`;
    // try {
    //   const response = await firstValueFrom(
    //     this.httpService.get(url, {
    //       headers: { Authorization: `Bearer ${accessToken}` },
    //     }),
    //   );
    //   // Cache and return the data or return empty if no results are found
    //   return response.data?.data || [];
    // } catch (error) {
    //   throw new HttpException(
    //     `Failed to fetch airport details for IATA code ${iataCode}: ${error.message}`,
    //     error.response?.status || 500,
    //   );
    // }
  }
}
