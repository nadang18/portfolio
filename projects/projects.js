import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// Project count on the header
document.querySelector('.header').textContent = projects.length + ' Projects';

// D3.js
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let selectedIndex = -1;

// Function to render the pie chart and legend
function renderPieChart(projectsGiven) {
  // Group projects by year and count the number of projects in each year
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  // Convert the rolled data to the required format
  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  // Clear existing paths and legend items
  d3.select('svg').selectAll('path').remove();
  d3.select('.legend').selectAll('li').remove();

  let svg = d3.select('svg');

 
  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : '')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        
        svg
          .selectAll('path')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

        d3.select('.legend')
          .selectAll('li')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'legend-item selected' : 'legend-item'));

        // Filter projects based on the selected year
        if (selectedIndex === -1) {
          renderProjects(projects, projectsContainer, 'h2');
        } else {
          let selectedYear = data[selectedIndex].label;
          let filteredProjects = projects.filter((project) => project.year === selectedYear);
          renderProjects(filteredProjects, projectsContainer, 'h2');
        }
      });
  });

  // Render updated legend
  data.forEach((d, idx) => {
    d3.select('.legend')
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', idx === selectedIndex ? 'legend-item selected' : 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}


renderPieChart(projects);


let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('change', (event) => {
  // update query value
  query = event.target.value.toLowerCase();
  
  // filter the projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query);
  });
  
  // render updated projects
  renderProjects(filteredProjects, projectsContainer, 'h2');
  
  // render updated pie chart and legend
  renderPieChart(filteredProjects);
});
