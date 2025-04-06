import React, { useState, useEffect } from 'react';
import RadarChart from './components/RadarChart';
import LineGraph from './components/LineGraph';
import TopicChart from './components/TopicChart';
import RegionChart from './components/RegionChart';
import CountryChart from './components/CountryChart'; 
import PESTBarChart from './components/PESTBarChart';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [filters, setFilters] = useState({
    endYear: '',
    topic: '',
    sector: '',
    region: '',
    country: '',
    pest: '',
    swot: '',
    source: '' // Added source filter
  });

  const [data, setData] = useState([]);

  // Fetch data from API with all filters applied
  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = Object.keys(filters)
          .filter(key => filters[key] !== '')  // Only include non-empty filters
          .map(key => `${key}=${filters[key]}`)
          .join('&');

        const response = await axios.get(`http://localhost:8000/api/insights/?${query}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Filter data based on selected End Year and SWOT filter
  const filteredDataByEndYear = filters.endYear
    ? data.filter(d => d.end_year === parseInt(filters.endYear, 10))
    : data;

  // Apply SWOT filter to the data
  const filteredSWOTData = filters.swot
    ? filteredDataByEndYear.filter(d => d.swot_category === filters.swot)
    : filteredDataByEndYear;

  // Filter data for PESTBarChart based on the selected PEST factor
  const filteredPestData = filters.pest
    ? filteredSWOTData.filter(d => d.pestle === filters.pest)
    : filteredSWOTData;

  // Filter by source
  const filteredSourceData = filters.source
    ? filteredPestData.filter(d => d.source === filters.source)
    : filteredPestData;

  return (
    <div className="App container">
      <header className="App-header">
        <h1>Data Visualization Dashboard</h1>
      </header>

      {/* Filters Section */}
      <div className="filters mb-4">
        <h3>Filters</h3>
        <div className="row mb-3">
          <div className="col">
            <label>PEST Filter:</label>
            <select name="pest" value={filters.pest} onChange={handleFilterChange} className="form-control">
              <option value="">Select PEST Factor</option>
              <option value="Political">Political</option>
              <option value="Economic">Economic</option>
              <option value="Social">Social</option>
              <option value="Technological">Technological</option>
            </select>
          </div>
          <div className="col">
            <label>SWOT Filter:</label>
            <select name="swot" value={filters.swot} onChange={handleFilterChange} className="form-control">
              <option value="">Select SWOT Factor</option>
              <option value="Strength">Strength</option>
              <option value="Weakness">Weakness</option>
              <option value="Opportunity">Opportunity</option>
              <option value="Threat">Threat</option>
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label>End Year:</label>
            <input 
              type="number" 
              name="endYear" 
              value={filters.endYear} 
              onChange={handleFilterChange} 
              className="form-control" 
              placeholder="Enter End Year"
            />
          </div>
          <div className="col">
            <label>Source:</label>
            <input 
              name="source" 
              value={filters.source} 
              onChange={handleFilterChange} 
              className="form-control" 
              placeholder="Enter Source"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label>Topic:</label>
            <input 
              name="topic" 
              value={filters.topic} 
              onChange={handleFilterChange} 
              className="form-control" 
              placeholder="Enter Topic"
            />
          </div>
          <div className="col">
            <label>Sector:</label>
            <input 
              name="sector" 
              value={filters.sector} 
              onChange={handleFilterChange} 
              className="form-control" 
              placeholder="Enter Sector"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label>Region:</label>
            <input 
              name="region" 
              value={filters.region} 
              onChange={handleFilterChange} 
              className="form-control" 
              placeholder="Enter Region"
            />
          </div>
          <div className="col">
            <label>Country:</label>
            <input 
              name="country" 
              value={filters.country} 
              onChange={handleFilterChange} 
              className="form-control" 
              placeholder="Enter Country"
            />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts d-flex flex-wrap">
        <div className="mb-5 col-12 col-md-6">
          <h4>Line Graph (Year vs Intensity)</h4>
          <LineGraph data={filteredSourceData} />
        </div>

        <div className="mb-5 col-12 col-md-6">
          <h4>Radar Chart (Intensity, Likelihood, Relevance)</h4>
          <RadarChart data={filteredSourceData} />
        </div>

        <div className="mb-5 col-12 col-md-6">
          <h4>Topic Chart</h4>
          <TopicChart data={filteredSourceData} />
        </div>

        <div className="mb-5 col-12 col-md-6">
          <h4>Region Chart</h4>
          <RegionChart data={filteredSourceData} filters={filters} />
        </div>

        <div className="mb-5 col-12 col-md-6">
          <h4>Country Chart</h4>
          <CountryChart data={filteredSourceData} filters={filters} />
        </div>

        <div className="mb-5 col-12 col-md-6">
          <h4>PESTBarChart</h4>
          <PESTBarChart data={filteredPestData} />
        </div>
      </div>
    </div>
  );
}

export default App;
