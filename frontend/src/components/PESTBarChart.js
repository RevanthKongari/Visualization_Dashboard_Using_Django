import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PESTBarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    renderPESTBarChart(data);
  }, [data]);

  const renderPESTBarChart = (data) => {
    d3.select(svgRef.current).selectAll("*").remove();

    // Filter data for valid pestle fields and intensity
    const filteredData = data.filter(d => d.pestle && d.intensity);

    if (filteredData.length === 0) {
      d3.select(svgRef.current)
        .append('text')
        .text('No data available for the selected PEST filter.')
        .attr('x', 50)
        .attr('y', 50);
      return;
    }

    const margin = { top: 20, right: 30, bottom: 100, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Group data by PESTLE category and calculate average intensity
    const intensityData = d3.rollup(
      filteredData,
      v => d3.mean(v, d => d.intensity),
      d => d.pestle
    );

    const categories = Array.from(intensityData.keys());
    const values = Array.from(intensityData.values());

    // Set up scales
    const x = d3.scaleBand()
      .domain(categories)
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(values)])
      .range([height, 0]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Create bars
    svg.selectAll('.bar')
      .data(Array.from(intensityData))
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

export default PESTBarChart;
