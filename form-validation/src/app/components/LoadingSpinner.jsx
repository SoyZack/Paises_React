export default function LoadingSpinner({ message = "Cargando información..." }) {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center gap-3 py-5" role="status">
            <span className="spinner-border text-primary" aria-hidden="true" />
            <span className="small text-secondary">{message}</span>
        </div>
    );
}