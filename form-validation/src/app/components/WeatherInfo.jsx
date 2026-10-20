import LoadingSpinner from "./LoadingSpinner";

export default function WeatherInfo({ weather, loading, error, capitalName}) {
    if (loading) {
        return <LoadingSpinner message="Consultado el clima de la capital..."/>;
    }

    if (error) {
        return (
            <div className="alert alert-danger mb-0" role="alert">
                <h3 className="h6 alert-heading fw-semibold">Aviso meteorológico</h3>
                <p className="small mb-0">{error}</p>
            </div>
        );
    }

    if (!weather) {
        return (
            <div className="card app-panel">
                <div className="card-body text-center text-secondary py-4">
                    <h3 className="h6 fw-bold text-body">Clima de la capital</h3>
                    <p className="small mb-0">
                        Selecciona un país para consultar el clima actual
                        {capitalName ? ` de ${capitalName}` : ' de su capital'}.
                    </p>
                </div>
            </div>
        );
    }

    const temp = Math.round(weather?.main?.temp?? 0);
    const status = weather?.weather?.[0]?.description || 'N/A';
    const humidity = weather?.main?.humidity ?? 0;
    const windSpeed = weather?.wind?.speed ?? 0;

    return (
        <div className="card weather-panel shadow-sm">
            <div className="card-body p-4 p-md-4">
                <div className="mb-3">
                    <h3 className="h5 fw-bold mb-1">Clima en {weather.name || capitalName}</h3>
                    <p className="small text-white-50 text-uppercase mb-0">Reporte actual</p>
                </div>
                <div className="row g-3">
                    <div className="col-6">
                        <div className="weather-stat p-3">
                            <p className="small text-white-50 mb-1">Temperatura</p>
                            <p className="h3 fw-bold mb-0">{temp} °C</p>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="weather-stat p-3">
                            <p className="small text-white-50 mb-1">Estado</p>
                            <p className="fw-semibold text-capitalize mb-0" title={status}>{status}</p>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="weather-stat p-3">
                            <p className="small text-white-50 mb-1">Humedad</p>
                            <p className="h4 fw-bold mb-0">{humidity} %</p>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="weather-stat p-3">
                            <p className="small text-white-50 mb-1">Viento</p>
                            <p className="h4 fw-bold mb-0">{windSpeed} m/s</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}