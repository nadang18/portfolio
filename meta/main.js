let data = [];
let commits = [];
let xScale, yScale;  // Make scales global
let rScale;
let brushSelection = null; 
let dots;

async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
        ...row,
        line: Number(row.line),
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime),
    }));


document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
  });

    processCommits();
    displayStats();
    createScatterplot();
}

function processCommits() {
    commits = d3.groups(data, (d) => d.commit)
        .map(([commit, lines]) => {
            let first = lines[0];
            let { author, date, time, timezone, datetime } = first;
            let ret = {
                id: commit,
                url: `https://github.com/vis-society/lab-7/commit/${commit}`,
                author,
                date,
                time,
                timezone,
                datetime,
                hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                totalLines: lines.length,
            };

            Object.defineProperty(ret, 'lines', {
                value: lines,
                writable: false,
                enumerable: false,
                configurable: false
            });

            return ret;
        });
}

function displayStats() {
  const dl = d3.select("#stats").append("dl").attr("class", "stats");

  dl.append("dt").html("Total <abbr title='Lines of code'>LOC</abbr>");
  dl.append("dd").text(data.length);

  dl.append("dt").text("Total Commits");
  dl.append("dd").text(commits.length);

  const numFiles = d3.groups(data, (d) => d.file).length;
  dl.append("dt").text("Number of Files");
  dl.append("dd").text(numFiles);

  const avgLineLength = d3.mean(data, (d) => d.length);
  dl.append("dt").text("Average Line Length (chars)");
  dl.append("dd").text(avgLineLength.toFixed(2));
}

