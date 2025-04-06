import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineGraph = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    renderLineGraph(data);
  }, [data]);

  const renderLineGraph = (data) => {
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Check if there's any data left after filtering by SWOT
    if (data.length === 0) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .text('No data available for the selected SWOT filter.');
      return;
    }

    const x = d3.scaleLinear()
      .domain([d3.min(data, d => d.end_year || d.start_year), d3.max(data, d => d.end_year || d.start_year)])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.intensity)])
      .range([height, 0]);

    const line = d3.line()
      .x(d => x(d.end_year || d.start_year))
      .y(d => y(d.intensity));

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append('g')
      .call(d3.axisLeft(y));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#69b3a2')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // Interactive points with tooltips
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.end_year || d.start_year))
      .attr("cy", d => y(d.intensity))
      .attr("r", 4)
      .attr("fill", "#ffab00")
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 8).attr('fill', '#ff5733');
        svg.append('text')
          .attr('x', event.pageX + 10)
          .attr('y', event.pageY - 10)
          .attr('class', 'tooltip')
          .text(`Year: ${d.end_year || d.start_year}, Intensity: ${d.intensity}`)
          .attr('fill', '#000');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 4).attr('fill', '#ffab00');
        svg.selectAll('.tooltip').remove();
      });

    // Add axis labels
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.bottom - 10)
      .text("Year");

    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -margin.top)
      .text("Intensity");
  };

  return <svg ref={svgRef}></svg>;
};

export default LineGraph;
