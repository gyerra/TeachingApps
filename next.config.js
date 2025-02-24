require('dotenv').config({ path: '.env.local' });

module.exports = {
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    API_KEY: process.env.API_KEY,
  },
};
