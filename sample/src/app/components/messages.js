export default function Message({ text, sender, image }) {
    if (sender === "user") {
        // User messages with rounded bubble styling
        return (
            <div 
                className="mb-3 d-flex justify-content-end"
                style={{
                    animation: 'fadeInUp 0.3s ease-out',
                    opacity: 1
                }}
            >
                <div 
                    className="badge bg-primary p-3 rounded-pill"
                    style={{
                        maxWidth: '75%',
                        fontSize: '0.9rem',
                        lineHeight: '1.4',
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {text}
                </div>
            </div>
        );
    } else {
        // Bot messages with clean, minimal styling
        return (
            <div 
                className="mb-3 d-flex justify-content-start"
                style={{
                    animation: 'fadeInUp 0.3s ease-out',
                    opacity: 1
                }}
            >
                <div 
                    style={{
                        maxWidth: '85%',
                        fontSize: '0.95rem',
                        lineHeight: '1.5',
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        color: '#ededed',
                        padding: '8px 6px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {text}
                    {image && (
                        <div style={{ marginTop: '10px' }}>
                            <img src={image} alt="Generated" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}