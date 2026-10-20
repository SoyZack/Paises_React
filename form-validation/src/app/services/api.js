const COUNTRIES_DATA_URL = 'https://cdn.jsdelivr.net/gh/mledoze/countries@master/countries.json';
const POPULATION_DATA_URL = 'https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=400&date=2024';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function getCountries() {
  try {
    const [countriesResponse, populationResponse] = await Promise.all([
      fetch(COUNTRIES_DATA_URL),
      fetch(POPULATION_DATA_URL),
    ]);

    if (!countriesResponse.ok) {
      throw new Error(`No se pudieron obtener los países (HTTP ${countriesResponse.status}).`);
    }
    if (!populationResponse.ok) {
      throw new Error(`No se pudieron obtener los datos de población (HTTP ${populationResponse.status}).`);
    }

    const [countriesData, populationData] = await Promise.all([
      countriesResponse.json(),
      populationResponse.json(),
    ]);

    if (!Array.isArray(countriesData)) {
      throw new Error('La fuente de países devolvió un formato inesperado.');
    }
    if (!Array.isArray(populationData?.[1])) {
      throw new Error('La fuente de población devolvió un formato inesperado.');
    }

    const populationByCode = new Map(
      populationData[1]
        .filter((item) => item.countryiso3code && item.value != null)
        .map((item) => [item.countryiso3code, item.value])
    );

    return countriesData
      .filter((country) => country.name?.common && country.cca3)
      .map((country) => {
        const countryCode = country.cca2?.toLowerCase();
        const countryName = country.name.common;

        return {
          name: country.name,
          flags: countryCode
            ? {
                svg: `https://flagcdn.com/${countryCode}.svg`,
                png: `https://flagcdn.com/w320/${countryCode}.png`,
                alt: `Bandera de ${countryName}`,
              }
            : undefined,
          capital: country.capital,
          cca3: country.cca3,
          region: country.region,
          population: populationByCode.get(country.cca3) ?? null,
        };
      });
  } catch (error) {
    console.error('Error en getCountries:', error);
    throw error;
  }
}

export async function getCapitalWeather(capital) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('La API Key de OpenWeatherMap no está configurada en las variables de entorno.');
  }

  try {
    const response = await fetch(
      `${WEATHER_API_URL}?q=${encodeURIComponent(capital)}&appid=${apiKey}&units=metric&lang=es`
    );
    
    if (!response.ok) {
      throw new Error(`No se pudo obtener el clima para la capital: ${capital}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getCapitalWeather:', error);
    throw error;
  }
}