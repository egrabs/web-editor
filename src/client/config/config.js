// TODO, some things in this config file
// should be dynamically determined at build time
// based on whether the environment is production or dev

// ex: baseUrl for server needs to be different depending
// on whether we are on prod or dev

const config = {
    server: {
        baseUrl: 'http://0.0.0.0:1234',
    },
};

export default config;
