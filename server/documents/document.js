module.exports = ({ associates }) => {
  let locationCounts = {};
  associates.forEach((item) => {
    locationCounts[item.location] = (locationCounts[item.location] || 0) + 1;
  });
  const chartData = {
    labels: Object.keys(locationCounts),
    datasets: [
      {
        label: "Number of Associates",
        data: Object.values(locationCounts),
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.4)",
        hoverBorderColor: "rgba(75,192,192,1)",
      },
    ],
  };
  return `
  <!doctype html>
  <html>
      <head>
          <meta charset="utf-8">
          <title>Employees Report </title>
          <script src="https://cdn.jsdelivr.net/npm/react-chartjs-2@5.2.0/dist/index.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/chart.js@4.3.3/dist/chart.umd.min.js"></script>
          </head>
          <body>
            <Bar
            data=${chartData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              indexAxis: "x", // Set this to 'y' to make the bars horizontal (optional)
              barThickness: 80, // Adjust this value to change the width of the bars
            }}
          />
          </body>
  </html>
`;
};
