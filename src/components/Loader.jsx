export default function Loader({ loading }) {
    if (loading) {
        return (
            <div
                data-cy="loading"
                className="alert alert-primary loader"
                style={{
                    width: '95vw',
                    height: '70vh',
                    padding: '30vh 50vh',
                    margin: '0 1rem',
                }}
            >
                <span className="sr-only" style={{ fontSize: '2rem' }}>
                    Loading...
                </span>

                <div
                    className="spinner-border text-primary m-5"
                    style={{ width: '5rem', height: '5rem' }}
                >
                    <span className="sr-only"></span>
                </div>
            </div>
        )
    }

    return null
}
