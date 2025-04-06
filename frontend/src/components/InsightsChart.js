// src/components/InsightsChart.js
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const InsightsChart = ({ dataKey, filters }) => {
  const svgRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Build query string from filters
        const query = Object.keys(filters)
          .filter(key => filters[key] !== '')
          .map(key => `${key}=${filters[key]}`)
          .join('&');

        // Fetch filtered data from the API
        const response = await axios.get(`http://localhost:8000/api/insights/?${query}`);
        renderChart(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dataKey, filters]);

  const renderChart = (data) => {
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Handle missing or empty values
    const filteredData = data.filter(d => d[dataKey] !== "" && d[dataKey] !== null);

    // Handle cases for year (use start_year or end_year)
    const dataForKey = filteredData.map(d => {
      if (dataKey === 'year') {
        return d.end_year || d.start_year || 'Unknown';
      } else {
        return d[dataKey];
      }
    });

    const x = d3.scaleBand()
      .domain(dataForKey)
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d.intensity)]) // Example: using intensity as y-axis value
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    svg.selectAll('.bar')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(dataKey === 'year' ? (d.end_year || d.start_year || 'Unknown') : d[dataKey]))
      .attr('y', d => y(d.intensity))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.intensity))
      .attr('fill', '#69b3a2')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', '#ffab00');
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('fill', '#69b3a2');
      });
  };

  return <svg ref={svgRef}></svg>;
};

export default InsightsChart;


