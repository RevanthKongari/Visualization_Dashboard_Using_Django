import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TopicChart = ({ data }) => {  
  const svgRef = useRef();

  useEffect(() => {
    renderTopicChart(data);
  }, [data]);

  const renderTopicChart = (data) => {
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 100, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    // Group data by topic and calculate the average intensity
    const topicData = d3.rollup(
      data,
      v => d3.mean(v, d => d.intensity),  // Calculating average intensity
      d => d.topic
    );

    const topics = Array.from(topicData.keys());
    const topicValues = Array.from(topicData.values());

    const x = d3.scaleBand()
      .domain(topics)
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(topicValues)])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px")
      .style("text-anchor", "end")
      .attr("transform", "translate(-10,0) rotate(-45)");  // Rotate for clarity

    svg.append('g')
      .call(d3.axisLeft(y));

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg.selectAll('.bar')
      .data(topicData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d[0]))  // Topic name
      .attr('y', d => y(d[1]))  // Value based on intensity
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d[1]))
      .attr('fill', '#69b3a2')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', '#ffab00');
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`Topic: ${d[0]}<br>Average Intensity: ${d[1].toFixed(2)}`)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on('mouseout', function() {
        d3.select(this).attr('fill', '#69b3a2');
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
  };

  return <svg ref={svgRef}></svg>;
};

export default TopicChart;
