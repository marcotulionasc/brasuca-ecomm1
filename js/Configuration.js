const config = {
    production: true, // Altere para false em desenvolvimento
    urls: {
        production: "https://assuring-amazingly-monitor.ngrok-free.app",
        development: "http://187.34.212.10:9090"
    },
    getBaseUrl: function() {
        return this.production ? this.urls.production : this.urls.development;
    }
};

export default config;
