'use client'

import {useState, useEffect } from 'react'
import { getCountries, getCapitalWeather } from './services/api';
import CountryList from './components/CountryList';
import WeatherInfo from './components/WeatherInfo';
import Image from 'next/image';

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const [errorGlobal, setErrorGlobal] = useState(null);
  const [errorWeather, setErrorWeather] = useState(null)

  // Cargar lista de paises al iniciar la app
  useEffect(() => {
    async function fetchCountriesData(){
      try {
        setLoadingCountries(true);
        setErrorGlobal(null);
        const data = await getCountries();
        // Ordenar alfabéticamente por nombre común
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(data);
      } catch (err) {
        setErrorGlobal('No se pudo cargar la lista de países. Verifique su conexión de red.');
      } finally {
        setLoadingCountries(false);
      }
    }

    fetchCountriesData();
  }, []);

  // Consultar el clima cada vez que el usuario selecciona un país
  useEffect(() => {
    async function fetchWeather() {
      if (!selectedCountry) return;

      const capital = selectedCountry.capital?.[0];
      if (!capital) {
        setWeather(null);
        setErrorWeather('Este país no cuenta con una capital registrada oficialmente en la API.');
        return;
      }

      try {
        setLoadingWeather(true);
        setErrorWeather(null);
        const weatherData = await getCapitalWeather(capital);
        setWeather(weatherData);
      } catch (err) {
        setWeather(null);
        setErrorWeather('Error al consultar el servicio del clima para esta capital.');
      } finally {
        setLoadingWeather(false);
      }
    }

    fetchWeather();
  }, [selectedCountry]);

  return (
    <main className="app-shell">
      <header className="app-header py-5">
        <div className="container py-2">
          <span className="badge rounded-pill text-bg-light text-primary mb-3">Explora el mundo</span>
          <h1 className="display-5 fw-bold">Países y clima</h1>
          <p className="lead mb-0">Información de países y el clima actual de sus capitales.</p>
        </div>
      </header>

      <div className="container py-4 py-lg-5">
        {errorGlobal && (
          <div className="alert alert-danger mb-4" role="alert">
            {errorGlobal}
          </div>
        )}

        <div className="row g-4">
          <section className="col-12 col-lg-7">
            <div className="card app-panel h-100">
              <div className="card-body p-3 p-md-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h2 className="h4 fw-bold mb-1">Lista de países</h2>
                    <p className="text-secondary small mb-0">Busca y selecciona un país.</p>
                  </div>
                  {!loadingCountries && (
                    <span className="badge rounded-pill text-bg-light">
                      {countries.length} países
                    </span>
                  )}
                </div>
                <CountryList
                  countries={countries}
                  selectedCountry={selectedCountry}
                  onSelectCountry={setSelectedCountry}
                  loading={loadingCountries}
                />
              </div>
            </div>
          </section>

          <section className="col-12 col-lg-5">
            <div className="d-flex flex-column gap-4">
              <div className="card app-panel">
                <div className="card-body p-3 p-md-4">
                  <h2 className="h4 fw-bold mb-3">Detalles del país</h2>

                  {selectedCountry ? (
                    <>
                      <div className="d-flex align-items-center gap-3 mb-4">
                        <div className="detail-flag">
                          {selectedCountry.flags?.svg || selectedCountry.flags?.png ? (
                            <Image
                              src={selectedCountry.flags.svg || selectedCountry.flags.png}
                              alt={`Bandera de ${selectedCountry.name.common}`}
                              fill
                              sizes="96px"
                            />
                          ) : (
                            <div className="d-flex h-100 align-items-center justify-content-center text-secondary small">
                              Sin bandera
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="h5 fw-bold mb-1">{selectedCountry.name.common}</h3>
                          <p className="text-secondary mb-0">{selectedCountry.region || 'Región no disponible'}</p>
                        </div>
                      </div>

                      <div className="row g-3 border-top pt-3">
                        <div className="col-6">
                          <span className="d-block text-secondary small">Capital</span>
                          <span className="fw-semibold">{selectedCountry.capital?.[0] ?? 'No disponible'}</span>
                        </div>
                        <div className="col-6">
                          <span className="d-block text-secondary small">Población</span>
                          <span className="fw-semibold">
                            {selectedCountry.population?.toLocaleString() ?? 'N/A'} hab.
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-secondary py-4">
                      Selecciona un país para ver su información.
                    </div>
                  )}
                </div>
              </div>

              <WeatherInfo
                weather={weather}
                loading={loadingWeather}
                error={errorWeather}
                capitalName={selectedCountry?.capital?.[0]}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}