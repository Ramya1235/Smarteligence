import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
// import { Bar } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Chart from "chart.js/auto";
import { useDispatch, useSelector } from "react-redux";
import { getLocations } from "../../features/user/userSlice";
const Report = () => {
  // const [locations, setLocations] = useState([]);
  const [locationData, setLocationData] = useState({});
  // const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.user.locations);

  useEffect(() => {
    // Make API request to fetch data
    const getLocation = async () => {
      try {
        const { data } = await axios.get("/associates", {
          headers: {
            "x-token": localStorage.getItem("token"),
          },
        });
        console.log(data);
        // const associateDetails = data; // Create a dictionary to store data for each location
        // console.log(response.data.location);
        dispatch(getLocations(data));
        console.log(locations);
        // const locationData = new Set(
        //   associateDetails.map((item) => item.location)
        // );
        // const uniqueLocation = [...locationData];
        // setLocations(uniqueLocation);
        // console.log(uniqueLocation);

        const locationDataDict = {};
        locations.forEach((location) => {
          // Filter data for the specified location
          const locationData = data.filter(
            (entry) => entry.location === location
          );
          const associatesByMonth = {};

          locationData.forEach((entry) => {
            entry.checkInDates.forEach((date) => {
              const entryDate = new Date(date);

              const monthYear = `${entryDate.getFullYear()}-${(
                entryDate.getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}`; // Format: yyyy-MM
              console.log(monthYear);
              // Initialize the count for the month if it doesn't exist

              if (!associatesByMonth[monthYear]) {
                associatesByMonth[monthYear] = new Set();
              }
              console.log(associatesByMonth);
              // Add the associate to the set for the month

              associatesByMonth[monthYear].add(entry.associateId);
              console.log(associatesByMonth[monthYear]);
            });
          });

          // Prepare data for rendering

          const monthData = Object.entries(associatesByMonth).map(
            ([monthYear, associatesSet]) => ({
              monthYear,

              numberOfAssociates: associatesSet.size,
            })
          );
          locationDataDict[location] = monthData;
          console.log(monthData);
        });
        // Set the location data in the state

        setLocationData(locationDataDict);
        console.log(locationDataDict);

        // setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    getLocation();
  }, [dispatch]);

  const allMonths = locations?.flatMap((location) => {
    const locationEntries = locationData[location];
    if (Array.isArray(locationEntries)) {
      return locationEntries?.map((entry) => entry.monthYear);
    }
    return [];
  });

  const uniqueMonths = [...new Set(allMonths)];
  const monthNames = uniqueMonths.map((monthYear) => {
    const [year, month] = (monthYear || "").split("-");

    return `${new Date(year, month - 1).toLocaleString("en", {
      month: "short",
    })} ${year}`;
  });
  // Prepare data for the bar chart

  const chartData = {
    labels: monthNames,

    datasets: locations?.map((location) => ({
      label: `No of associates in ${location}`,

      data: uniqueMonths.map((month) => {
        const dataForLocation = locationData[location];
        console.log(dataForLocation);

        const dataForMonth = dataForLocation
          ? dataForLocation.find((entry) => entry && entry.monthYear === month)
          : null;
        console.log(dataForMonth);
        return dataForMonth ? dataForMonth.numberOfAssociates : 0;
      }),
    })),
  };

  // Create an array of objects with location names and their corresponding colors

  locations?.map((location) => ({
    backgroundColor: [location] || "rgba(0, 0, 0, 0.6)",
  }));

  // const chartOptions = {
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //       ticks: {
  //         precision: 0,
  //       },
  //     },
  //   },
  // };

  const generatePDF = async () => {
    try {
      // Check if the chart element is available in the DOM
      if (!chartRef.current) {
        throw new Error("Chart element not found.");
      }

      // Create an instance of jsPDF
      const pdf = new jsPDF("p", "mm", "a4");

      // Convert the entire component to canvas and add it to the PDF
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      pdf.addImage(imgData, "JPEG", 10, 10, 190, 150); // Adjust the size and position

      // Save the PDF with a given filename
      pdf.save("location_distribution_report.pdf");

      // Send the PDF to the server for email sending
      sendPDFToServer(pdf);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const sendPDFToServer = async (pdf) => {
    try {
      // Convert the PDF to a Blob
      const blob = pdf.output("blob");

      // Create a FormData object to send the PDF as a file
      const formData = new FormData();
      formData.append("pdf", blob, "location_distribution_report.pdf");

      // Send a POST request to your Node.js backend using Axios
      const response = await axios.post("/send-pdf-email", formData);

      if (response.status === 200) {
        console.log("PDF sent successfully!");
      } else {
        console.error("Failed to send PDF.");
      }
    } catch (error) {
      console.error("Error sending PDF to server:", error);
    }
  };

  return (
    <div>
      <h1>Associates' Logins by Month</h1>

      {/* {locations.map((location) => (
        <div key={location}>
          <h2>{location}</h2>

          <ul>
            {locationData[location].map((entry) => (
              <li key={entry.monthYear}>
                Month: {entry.monthYear}, Number of Associates:{" "}
                {entry.numberOfAssociates}
              </li>
            ))}
          </ul>
        </div>
      ))} */}
      <div ref={chartRef}>
        {chartData && (
          <div className="barGraph">
            <Bar data={chartData} />
          </div>
        )}
      </div>
      <div className="button-container">
        <button className="generatepdf btn btn-primary" onClick={generatePDF}>
          Generate PDF and Send
        </button>
      </div>
    </div>
  );
};

export default Report;

// import React, { useEffect, useState } from "react";

// import axios from "axios";

// function Report() {
//   const [data, setData] = useState({});

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Make API request to fetch data

//     axios
//       .get("/associates/m")

//       .then((response) => {
//         // Assuming the backend returns data in the format you provided

//         const backendData = response.data;

//         // Filter data for Bangalore location

//         const bangaloreData = backendData.filter(
//           (entry) => entry.location === response.data.location
//         );
//         // console.log(bangloreData)

//         // Create a dictionary to track associates by month

//         const associatesByMonth = {};

//         bangaloreData.forEach((entry) => {
//           entry.checkInDates.forEach((date) => {
//             const entryDate = new Date(date);

//             const monthYear = `${entryDate.getFullYear()}-${(
//               entryDate.getMonth() + 1
//             )

//               .toString()

//               .padStart(2, "0")}`; // Format: yyyy-MM

//             // Initialize the count for the month if it doesn't exist

//             if (!associatesByMonth[monthYear]) {
//               associatesByMonth[monthYear] = new Set();
//             }

//             // Add the associate to the set for the month

//             associatesByMonth[monthYear].add(entry.associateId);
//           });
//         });

//         // Prepare data for rendering

//         const monthData = Object.entries(associatesByMonth).map(
//           ([monthYear, associatesSet]) => ({
//             monthYear,

//             numberOfAssociates: associatesSet.size,
//           })
//         );

//         setData(monthData);

//         setLoading(false);
//       })

//       .catch((error) => {
//         console.error(error);

//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Associates' Logins by Month ({location})</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <ul>
//           {data.map((entry) => (
//             <li key={entry.monthYear}>
//               Month: {entry.monthYear}, Number of Associates:
//               {entry.numberOfAssociates}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
// export default Report;
// import React, { useEffect, useState } from "react";

// import axios from "axios";

// import { Pie } from "react-chartjs-2";

// function Report() {
//   const [data, setData] = useState({});
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [
//       {
//         data: [],
//         backgroundColor: [
//           "rgba(130, 120, 212, 0.6)",
//           "rgba(255, 99, 132, 0.6)",
//           "rgba(54, 162, 235, 0.6)",
//           "rgba(255, 206, 86, 0.6)",
//           "rgba(75, 192, 192, 0.6)",
//           "rgba(153, 102, 255, 0.6)",
//           "rgba(255, 159, 64, 0.6)",
//           "rgba(255, 190, 64, 0.6)",
//           "rgba(255, 151, 64, 0.6)",
//           "rgba(255, 199, 132, 0.6)",
//         ],
//       },
//     ],
//   });

//   useEffect(() => {
//     // Make API request to fetch data

//     axios
//       .get("/associates/m")

//       .then((response) => {
//         // Filter data for Bangalore location

//         const bangaloreData = response.data.filter(
//           (entry) => entry.location === "chennai"
//         );
//         console.log(bangaloreData);
//         // const dates = response.data.savedDates

//         // Process data to count logins for each month

//         const loginCounts = {};

//         bangaloreData.forEach((entry) => {
//           if(entry.checkInDates){
//           entry.checkInDates.forEach((date) => {
//             const entryDate = new Date(date);

//             const monthYear = `${entryDate.getFullYear()}-${(
//               entryDate.getMonth() + 1).toString().padStart(2, "0")}`; // Format: yyyy-MM
//               console.log(monthYear)

//             if (!loginCounts[monthYear]) {
//               loginCounts[monthYear] = 1;
//             } else {
//               loginCounts[monthYear]++;
//             }
//           });
//         }
//         });
//         const chartData = {
//           labels: Object.keys(loginCounts),

//           datasets: [
//             {
//               data: Object.values(loginCounts),

//               backgroundColor: [
//                 "rgba(255, 99, 132, 0.6)",

//                 "rgba(54, 162, 235, 0.6)",

//                 "rgba(255, 206, 86, 0.6)",

//                 // Add more colors as needed
//               ],
//             },
//           ],
//         };

//         setData(chartData);
//       })

//       .catch((error) => {
//         console.error(error);
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Associates' Logins by Month (Bangalore)</h2>
//       <Pie data={data} />
//     </div>
//   );
// }
// export default Report;

// /* eslint-disable no-unused-vars */
// import React, { useEffect, useState, useRef } from "react";
// import { Bar } from "react-chartjs-2";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import Chart from "chart.js/auto";
// import { useSelector } from "react-redux";
// import axios from "axios";
// const Report = () => {
//   const chartRef = useRef(null);
//   const [chartData, setChartData] = useState(null);
//   const associatesList = useSelector((state) => state.user.associatesList);
//   useEffect(() => {
//     const createChartData = () => {
//       if (associatesList) {
//         let locationCounts = {};
//         associatesList.forEach((item) => {
//           locationCounts[item.location] =
//             (locationCounts[item.location] || 0) + 1;
//         });

//         setChartData({
//           labels: Object.keys(locationCounts),
//           datasets: [
//             {
//               label: "Number of Associates",
//               data: Object.values(locationCounts),
//               backgroundColor: "rgba(75,192,192,0.6)",
//               borderColor: "rgba(75,192,192,1)",
//               borderWidth: 1,
//               hoverBackgroundColor: "rgba(75,192,192,0.4)",
//               hoverBorderColor: "rgba(75,192,192,1)",
//             },
//           ],
//         });
//       }
//     };

//     createChartData();
//   }, [associatesList]);

//   const generatePDF = async () => {
//     try {
//       // Check if the chart element is available in the DOM
//       if (!chartRef.current) {
//         throw new Error("Chart element not found.");
//       }

//       // Create an instance of jsPDF
//       const pdf = new jsPDF("p", "mm", "a4");

//       // Convert the entire component to canvas and add it to the PDF
//       const canvas = await html2canvas(chartRef.current);
//       const imgData = canvas.toDataURL("image/jpeg", 1.0);
//       pdf.addImage(imgData, "JPEG", 10, 10, 190, 150); // Adjust the size and position

//       // Save the PDF with a given filename
//       pdf.save("location_distribution_report.pdf");

//       // Send the PDF to the server for email sending
//       sendPDFToServer(pdf);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//     }
//   };

//   const sendPDFToServer = async (pdf) => {
//     try {
//       // Convert the PDF to a Blob
//       const blob = pdf.output("blob");

//       // Create a FormData object to send the PDF as a file
//       const formData = new FormData();
//       formData.append("pdf", blob, "location_distribution_report.pdf");

//       // Send a POST request to your Node.js backend using Axios
//       const response = await axios.post("/send-pdf-email", formData);

//       if (response.status === 200) {
//         console.log("PDF sent successfully!");
//       } else {
//         console.error("Failed to send PDF.");
//       }
//     } catch (error) {
//       console.error("Error sending PDF to server:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Location Distribution</h2>
//       <div ref={chartRef}>
//         {chartData && (
//           <div>
//             <Bar
//               data={chartData}
//               options={{
//                 scales: {
//                   y: {
//                     beginAtZero: true,
//                   },
//                 },
//                 indexAxis: "x", // Set this to 'y' to make the bars horizontal (optional)
//                 barThickness: 80, // Adjust this value to change the width of the bars
//               }}
//             />
//           </div>
//         )}
//       </div>
//       <div className="button-container">
//         <button className="generatepdf btn btn-primary" onClick={generatePDF}>
//           Generate PDF and Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Report;
