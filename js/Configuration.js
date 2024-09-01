const config = {
    production: true, // Altere para false em desenvolvimento
    urls: {
      production: "https://backend-ingressar.onrender.com",
        development: "http://191.205.83.233:9090"
    },
    getBaseUrl: function() {
        return this.production ? this.urls.production : this.urls.development;
    }
};

export default config;
