import Image from 'next/image';

export default function CountryCard({ country, onSelect, isSelected }) {
    const countryName = country?.name?.common || 'Pais desconocido';
    const capitalName = country?.capital?.[0] ?? 'Sin capital';
    const flagUrl = country?.flags?.svg || country?.flags?.png;

    return (
      <button
        type="button"
        onClick={() => onSelect(country)}
        aria-pressed={isSelected}
        className={`card country-card h-100 w-100 text-start ${
          isSelected ? 'country-card-selected' : ''
        }`}
      >
        <div className="country-flag position-relative rounded-top overflow-hidden">
          {flagUrl ? (
            <Image
              src={flagUrl}
              alt={country?.flags?.alt || `Bandera de ${countryName}`}
              fill
              sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw"
            />
          ) : (
            <div className="d-flex h-100 align-items-center justify-content-center text-secondary small">
              Sin bandera disponible
            </div>
          )}
        </div>
        <div className="card-body p-3">
          <h3 className="h6 fw-bold text-truncate mb-2" title={countryName}>
            {countryName}
          </h3>
          <p className="small text-secondary mb-1">
            Capital: <span className="text-body fw-medium">{capitalName}</span>
          </p>
          <p className="small text-secondary mb-0">Región: {country?.region || 'N/A'}</p>
        </div>
      </button>
    );
}