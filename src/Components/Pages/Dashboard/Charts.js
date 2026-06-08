import React from "react";
import ReactECharts from "echarts-for-react";

const Charts = () => {
  const option = {
    tooltip: {
      trigger: "item",
    },

    legend: {
      bottom: 10,
      left: "center",
      icon: "roundRect",
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 40,
      textStyle: {
        fontSize: 12,
        fontFamily: "'Poppins', sans-serif",
      },
    },

    series: [
      {
        type: "pie",

        radius: ["35%", "70%"],

        center: ["50%", "42%"],

        avoidLabelOverlap: false,

        label: {
          show: false,
        },

        labelLine: {
          show: false,
        },

        itemStyle: {
          borderWidth: 0,
          // borderRadius: 5,
        },

        data: [
          {
            value: 68,
            name: "Billable Hours",

            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,

                colorStops: [
                  {
                    offset: 0,
                    color: "#42E695",
                  },
                  {
                    offset: 1,
                    color: "#3BB2F6",
                  },
                ],
              },
            },
          },

          {
            value: 32,
            name: "Non Billable Hours",

            itemStyle: {
              color: "#9B8DE3",
            },
          },
        ],
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{
        height: "200px",
        width: "300px",
        // border: "1px solid red",
      }}
    />
  );
};

export default Charts;
