// Configuration
const numLines = 15;
const width = window.innerWidth;
const height = 400;
const speed = 0.02;
let time = 0;

const data = Array.from({ length: numLines }, (_, i) => (
    d3.range(0, width, 10).map(x => ({
        x,
        y: height / 2 + Math.sin(x * 0.005 + i * 0.5) * (20 + i * 2)
    }))
));

// Define colors
const baseColor = "#ccc";
const highlightColors = ["#f4c542", "#42c5f4"];

// Create SVG canvas
const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Define line generator
const line = d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveCatmullRom);

// Draw the lines
const paths = svg.selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", d => line(d))
    .attr("stroke", (d, i) => (i % 5 === 0 ? highlightColors[i % highlightColors.length] : baseColor))
    .attr("stroke-width", 1.5)
    .attr("fill", "none")
    .attr("opacity", 0);

// Initial fade-in animation
paths.each(function (d, i) {
    gsap.to(this, { opacity: 1, duration: 2, delay: i * 0.2, ease: "power2.out" });
});

// Wavy motion animation with increasing wave length and amplitude from right to left
function animateWaves() {
    time += speed;
    paths.each(function (d, i) {
        const newData = d.map(point => {
            const waveFactor = ((width - point.x) / width) * 3; // Decreasing frequency from right to left
            const amplitudeFactor = 1 + ((width - point.x) / width) * 1.5; // Increasing amplitude from right to left
            return {
                x: point.x,
                y: height / 2 + Math.sin(point.x * (0.005 + waveFactor * 0.002) + i * 0.5 + time + Math.sin(time * 0.5 + i * 0.3)) * (20 + i * 2) * amplitudeFactor
            };
        });
        d3.select(this).attr("d", line(newData));
    });
    requestAnimationFrame(animateWaves);
}

animateWaves();