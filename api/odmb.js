const axios = require('axios');

const apiKey = '40313529'; 
const endpointUrl = 'http://www.omdbapi.com/';

const getMaterials = async (params = {}) => {
  try {
    
    params.apikey = apiKey;
    console.log('Request Params:', params); 
    const response = await axios.get(endpointUrl, { params });
    console.log('API Response:', response.data);  
    return response.data;
  } catch (error) {
    console.error('Error fetching materials:', error.response.data);
    throw error;
  }
};

module.exports = {
  getMaterials
};
