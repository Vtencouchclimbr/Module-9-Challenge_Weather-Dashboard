import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties
class City {
  id: string;
  name: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  private async read() {
    return await fs.readFile('searchHistory.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile(
      'searchHistory.json',
      JSON.stringify(cities, null, '\t')
    );
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read().then((cities) => {
      let parsedCities: City[];
  
      try {
        parsedCities = JSON.parse(cities);
      } catch (err) {
        parsedCities = [];
      }
  
      return parsedCities;
    });
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<City> {
    const cities = await this.getCities();
    const newCity = new City(cityName, uuidv4());
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }
  
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(cityId: string): Promise<boolean> {
    const cities = await this.getCities();
    const filteredCities = cities.filter(city => city.id !== cityId);
    if (filteredCities.length === cities.length) {
      return false; // City not found
    }
    await this.write(filteredCities);
    return true; // City removed
  }
}

export default new HistoryService();
