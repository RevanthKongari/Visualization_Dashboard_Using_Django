import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CountryChart = ({ data, filters }) => {  
  const svgRef = useRef();

  useEffect(() => {
    renderCountryChart(data, filters);
  }, [data, filters]);

  const renderCountryChart = (data, filters) => {
    d3.select(svgRef.current).selectAll("*").remove();

    // Apply the PESTLE filter
    let filteredData = data;
    if (filters.pestle) {
      filteredData = filteredData.filter(d => d.pestle_field === filters.pestle);
    }

    // Check if filtered data is empty
    if (filteredData.length === 0) {
      const svg = d3.select(svgRef.current)
        .attr('width', 500)
        .attr('height', 300)
        .append('g')
        .attr('transform', `translate(50,150)`);

      svg.append('text')
        .text('No data available for the selected filters')
        .attr('fill', '#ff0000');
      return;  // Exit if there's no data
    }

    // Proceed with rendering the chart if data exists
    const margin = { top: 20, right: 30, bottom: 100, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Group filtered data by country and calculate the average intensity
    const countryData = d3.rollup(
      filteredData,
      v => d3.mean(v, d => d.intensity),
      d => d.country
    );

    const countries = Array.from(countryData.keys());
    const countryValues = Array.from(countryData.values());

    const x = d3.scaleBand()
      .domain(countries)
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(countryValues)])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px")
      .style("text-anchor", "end")
      .attr("transform", "translate(-10,0) rotate(-45)");

    svg.append('g')
      .call(d3.axisLeft(y));

    svg.selectAll('.bar')
      .data(countryData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d[0]))
      .attr('y', d => y(d[1]))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d[1]))
      .attr('fill', '#69b3a2');
  };

  return <svg ref={svgRef}></svg>;
};

export default CountryChart;
