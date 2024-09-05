const config = {
    production: false, // Altere para false em desenvolvimento
    urls: {
      production: "https://backend-ingressar.onrender.com",
        development: "http://localhost:8080"
    },
    getBaseUrl: function() {
        return this.production ? this.urls.production : this.urls.development;
    }
};

export default config;
