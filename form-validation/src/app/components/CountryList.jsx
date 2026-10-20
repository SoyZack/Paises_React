import { useState } from "react";
import CountryCard from "./CountryCard";
import LoadingSpinner from "./LoadingSpinner";

export default function CountryList({ countries = [], selectedCountry, onSelectCountry, loading }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCountries = countries.filter((country) => {
        const name = country?.name?.common || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return <LoadingSpinner message="Cargando lista de paises..." />;
    }

    return (
        <div>
            <div className="input-group mb-3">
                <span className="input-group-text bg-white" aria-hidden="true">
                    <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </span>
                <input
                    type="search"
                    className="form-control"
                    placeholder="Buscar país por nombre..."
                    aria-label="Buscar país por nombre"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>

            <div className="country-list-scroll pe-1">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
                {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                        <div className="col" key={country.cca3 || country.name.common}>
                            <CountryCard
                                country={country}
                                onSelect={onSelectCountry}
                                isSelected={selectedCountry?.cca3 === country.cca3}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center text-secondary py-5 small">
                        No se encontraron países que coincidan con &quot;{searchTerm}&quot;.
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}