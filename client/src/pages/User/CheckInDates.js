import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import axios from "axios";
import { useSelector } from "react-redux";
const CheckInDates = () => {
  const associate = useSelector((state) => state.user.associate);
  // const [locations,setLocations] = useState([])
  // const [dates, setDates] = useState([]);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "rgba(130, 120, 212, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 190, 64, 0.6)",
          "rgba(255, 151, 64, 0.6)",
          "rgba(255, 199, 132, 0.6)",
        ],
      },
    ],
  });


  useEffect(() => {
    // Replace this with your provided dates array
    // const dateStrings = [
    //   "Wed Aug 30 2023 05:30:00 GMT+0530 (India Standard Time)", "Wed sep 30 2023 05:30:00 GMT+0530 (India Standard Time)", "Wed oct 30 2023 05:30:00 GMT+0530 (India Standard Time)", "Wed sep 30 2023 05:30:00 GMT+0530 (India Standard Time)"
    // ];
    const getDates = async () => {
      try {
        const { data } = await axios.get(`/associate/${associate.id}/dates`);
        if (Array.isArray(data.savedDates)) {
          // Parse the ISO date strings into a more user-friendly format
          const formattedDates = data.savedDates.map((isoDate) => {
            return new Date(isoDate);
            // Customize the format as needed
          });
          const monthCounts = {}; // Calculate the number of dates for each month
          formattedDates.forEach((dateString) => {
            const date = new Date(dateString);
            const month = date.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            });
            if (monthCounts[month]) {
              monthCounts[month]++;
            } else {
              monthCounts[month] = 1;
            }
          });
          const labels = Object.keys(monthCounts);
          const dataValues = Object.values(monthCounts);
          console.log(dataValues);
          setChartData({
            ...chartData,
            labels,

            datasets: [{ ...chartData.datasets[0], data: dataValues }],
          });
        } else {
          console.error("Saved dates are not in an array:", data.savedDates);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getDates();
  }, [associate.id]); // Empty dependency array ensures useEffect runs once on mount

  //    useEffect(() => {
  //   const monthCounts = {}; // Calculate the number of dates for each month
  //   dates.forEach((dateString) => {
  //     const date = new Date(dateString);
  //     const month = date.toLocaleDateString("en-US", {
  //       month: "long",
  //       year: "numeric",
  //     });
  //     if (monthCounts[month]) {
  //       monthCounts[month]++;
  //     } else {
  //       monthCounts[month] = 1;
  //     }
  //   });
  //   const labels = Object.keys(monthCounts);
  //   const dataValues = Object.values(monthCounts);
  //   setChartData({
  //     ...chartData,
  //     labels,

  //     datasets: [{ ...chartData.datasets[0], data: dataValues }],
  //   });
  //  }, []);

  return (
    <div style={{ width: "400px", height: "400px" }}>
      {/* Adjust the width and height as needed */}
      <h2>Date Distribution by Month</h2>
      <Pie
        data={chartData}
      />
    </div>
  );
}
export default CheckInDates;


