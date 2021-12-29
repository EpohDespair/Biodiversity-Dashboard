// read in samples.json
d3.json("data/samples.json").then((importedData) => {

	// define variables
    var samples = importedData.samples
    var metadata = importedData.metadata

    // Create variables for chart
        var sample_values = samples.sample_values    
        var otu_ids = samples.otu_ids
        var otu_labels = samples.otu_labels

	// Bar chart
        var bar_trace = {
			x: sample_values.slice(0, 10).reverse(),
			y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
			text: otu_labels.slice(0, 10).reverse(),
			type: "bar",
			orientation: "h"
		};

		// Apply layout
		var barlayout = {
			title: `<b>Top 10 Microbes found in Selected Subject<b>`,
			xaxis: { title: "Sample Value"},
			yaxis: { title: "OTU ID"},
			autosize: false,
			width: 450,
			height: 600
		}

		Plotly.newPlot("bar", bar_trace, barlayout);
 
        // Bubble Chart
 var bubble_trace = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
        color: otu_ids,
        size: sample_values
    }
};

var bubbleLayout = {
    title: '<b>Bubble Chart samples of selected subject <b>',
    xaxis: { title: "OTU IDs"},
    yaxis: { title: "Sample Values"}, 
};

Plotly.newPlot('bubble', bubble_trace, bubbleLayout);

// Display metadata demo info
function populateDemoInfo(patientID) {

    var demographicInfoBox = d3.select("#sample-metadata");

    d3.json("samples.json").then(data => {
        var metadata = data.metadata
        var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

        console.log(filteredMetadata)
        Object.entries(filteredMetadata).forEach(([key, value]) => {
            demographicInfoBox.append("p").text(`${key}: ${value}`)
        })


    })
}
// Display key-value pair
function initDashboard() {
    var dropdown = d3.select("#selDataset")
    d3.json("samples.json").then(data => {
        var patientIDs = data.names;
        patientIDs.forEach(patientID => {
            dropdown.append("option").text(patientID).property("value", patientID)
        })
        buildCharts(patientIDs[0]);
        populateDemoInfo(patientIDs[0]);
    });
};

initDashboard();

// Change of patient ID
function optionChanged(patientID) {
    console.log(patientID);
    buildCharts(patientID);
    populateDemoInfo(patientID);
}

// Bonus: Gauge chart
// Get the washing frequency value for the default test ID
var wfreq = metadata.wfreq;

var gaugeData = [
    {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: {text: '<b>Washing Frequency</b> <br> Times per week'},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: { range: [null, 9] },
            steps: [
                { range: [0, 3], color: 'rgb(253, 162, 73)' },
                { range: [3, 6], color: 'rgb(242, 113, 102)' },
                { range: [6, 9], color: 'rgb(166, 77, 104)' },
            ],
        }
    }
];

var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

Plotly.newPlot('gauge', gaugeData, gaugeLayout);
});