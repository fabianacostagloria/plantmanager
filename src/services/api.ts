import data from './server.json'; 

const api = {
  getPlantsWaterFrequencies() {
    return data.plants_water_frequencies;
  },
  getPlantsEnvironments() {
    return data.plants_environments;
  },
  getPlants() {
    return data.plants;
  }
};

export default api;
