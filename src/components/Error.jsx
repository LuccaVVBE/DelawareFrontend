export default function Error({ error }) {
    if (error) {
        return (
            <div
                className="alert alert-danger"
                style={{
                    width: '95vw',
                    height: '70vh',
                    padding: '30vh 50vh',
                    margin: '0 1rem',
                }}
                data-cy="error"
            >
                <h4 className="alert-heading">An error occured</h4>
                {error.message || JSON.stringify(error)}
            </div>
        )
    }

    return null
}
