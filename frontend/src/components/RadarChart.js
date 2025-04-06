import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RadarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    renderRadarChart(data);
  }, [data]);

  const renderRadarChart = (data) => {
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 50, right: 80, bottom: 50, left: 80 };
    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

    // Define radar metrics with a common scale (normalization)
    const radarMetrics = [
      { axis: 'Intensity', value: d3.mean(data, d => d.intensity) || 0 },
      { axis: 'Likelihood', value: d3.mean(data, d => d.likelihood) || 0 },
      { axis: 'Relevance', value: d3.mean(data, d => d.relevance) || 0 }
    ];

    const maxValue = 10;  // Set a common maximum value for scaling (normalized scale 0-10)
    const angleSlice = (2 * Math.PI) / radarMetrics.length;

    const radialScale = d3.scaleLinear()
      .domain([0, maxValue])  // Normalized between 0 and maxValue
      .range([0, radius]);

    // Define the radar line
    const radarLine = d3.lineRadial()
      .radius(d => radialScale(d.value))
      .angle((d, i) => i * angleSlice);

    // Draw gridlines (concentric circles)
    const levels = 5;  // Number of gridlines
    for (let i = 0; i < levels; i++) {
      const levelFactor = radius * ((i + 1) / levels);
      svg.selectAll(".grid-circle")
        .data(radarMetrics)
        .enter()
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", levelFactor)
        .attr("stroke", "#cdcdcd")
        .attr("stroke-width", 0.75)
        .attr("fill", "none");
    }

    // Draw axis lines (from center to outer circle)
    radarMetrics.forEach((d, i) => {
      const angle = i * angleSlice;
      const x = radius * Math.cos(angle - Math.PI / 2);
      const y = radius * Math.sin(angle - Math.PI / 2);

      svg.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1);

      // Add axis labels
      svg.append('text')
        .attr('x', x * 1.1)
        .attr('y', y * 1.1)
        .attr('text-anchor', x < 0 ? 'end' : 'start')
        .text(d.axis)
        .attr('fill', '#000');
    });

    // Draw the radar area (polygon)
    svg.append('path')
      .datum(radarMetrics)
      .attr('fill', 'rgba(0, 128, 255, 0.3)')
      .attr('stroke', '#007bff')
      .attr('stroke-width', 2)
      .attr('d', radarLine);

    // Add interactive points (circles) on the polygon
    svg.selectAll('circle')
      .data(radarMetrics)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => radialScale(d.value) * Math.cos(i * angleSlice - Math.PI / 2))
      .attr('cy', (d, i) => radialScale(d.value) * Math.sin(i * angleSlice - Math.PI / 2))
      .attr('r', 5)
      .attr('fill', '#ffab00')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 8).attr('fill', '#ff5733');
        svg.append('text')
          .attr('x', radialScale(d.value) * Math.cos(angleSlice * radarMetrics.indexOf(d) - Math.PI / 2) + 10)
          .attr('y', radialScale(d.value) * Math.sin(angleSlice * radarMetrics.indexOf(d) - Math.PI / 2) - 10)
          .attr('class', 'tooltip')
          .text(`${d.axis}: ${d.value.toFixed(2)}`)
          .attr('fill', '#000');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 5).attr('fill', '#ffab00');
        svg.selectAll('.tooltip').remove();
      });
  };

  return <svg ref={svgRef}></svg>;
};

export default RadarChart;


