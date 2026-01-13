
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Character, Relationship } from '../types';

interface Props {
  characters: Character[];
  relationships: Relationship[];
}

const RelationshipMap: React.FC<Props> = ({ characters, relationships }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || characters.length === 0) return;

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // D3 v7에서는 d3.collide 대신 d3.forceCollide를 사용해야 합니다.
    const simulation = d3.forceSimulation(characters as any)
      .force("link", d3.forceLink(relationships).id((d: any) => d.id).distance(180))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    const link = svg.append("g")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(relationships)
      .join("line")
      .attr("stroke-width", 2);

    const node = svg.append("g")
      .selectAll("g")
      .data(characters)
      .join("g")
      .attr("class", "node-group")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    node.append("circle")
      .attr("r", 45)
      .attr("fill", "#6366f1")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .attr("filter", "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07))");

    node.append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "#fff")
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [characters, relationships]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 text-lg">인물 관계망</h3>
        <p className="text-xs text-slate-500 font-medium">드래그하여 인물을 배치해보세요</p>
      </div>
      <div className="relative w-full aspect-video bg-slate-50/50">
        <svg
          ref={svgRef}
          viewBox="0 0 800 600"
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />
      </div>
    </div>
  );
};

export default RelationshipMap;
