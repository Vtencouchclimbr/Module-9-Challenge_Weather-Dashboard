import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherDescription: string;
  weatherIcon: string;

  constructor(temperature: number, humidity: number, windSpeed: number, weatherDescription: string, weatherIcon: string) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.weatherDescription = weatherDescription;
    this.weatherIcon = weatherIcon;

  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}';
  private apiKey = process.env.OPENWEATHER_API_KEY;
  private cityName: string;

  constructor(cityName: string) {
    this.cityName = cityName;
  }
  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(`${this.baseURL}geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
    const data = await response.json();
    return data[0]; // Assuming the first result is the desired location
  }
  // TODO: Create destructureLocationData method
private destructureLocationData(locationData: any): Coordinates {
  return {
    lat: locationData.lat,
    lon: locationData.lon
  };
}
  // TODO: Create buildGeocodeQuery method
private buildGeocodeQuery(): string {
  return `${this.cityName}`;
}
  // TODO: Create buildWeatherQuery method
private buildWeatherQuery(coordinates: Coordinates): string {
  return `${this.baseURL}forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
}
  // TODO: Create fetchAndDestructureLocationData method
private async fetchAndDestructureLocationData(): Promise<Coordinates> {
  const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
}
  // TODO: Create fetchWeatherData method
private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
  const response = await fetch(this.buildWeatherQuery(coordinates));
    return await response.json();
}
  // TODO: Build parseCurrentWeather method
private parseCurrentWeather(response: any): Weather {
  return new Weather(
    currentWeather.main.temp,
    currentWeather.main.humidity,
    currentWeather.wind.speed,
    currentWeather.weather[0].description,
    currentWeather.weather[0].icon
  );
}
  // TODO: Complete buildForecastArray method
private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
  return weatherData.map(data => {
    return new Weather(
      data.main.temp,
      data.main.humidity,
      data.wind.speed,
      data.weather[0].description,
      data.weather[0].icon
    );
  });
}
  // TODO: Complete getWeatherForCity method
async getWeatherForCity(city: string): Promise<any> {
  try {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(currentWeather, weatherData.list.slice(1)); // Exclude current weather
    return {
      current: currentWeather,
      forecast
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
  }
}
export default new WeatherService('');
