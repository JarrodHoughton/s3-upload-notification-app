import * as React from "react";
import MixedLineBarChart from "@cloudscape-design/components/mixed-line-bar-chart";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import { Link } from "react-router-dom";

var Chart = ({data}) => {
    function parseTimestamp(timestampStr) {
        return new Date(timestampStr);
    }

    // Function to round down timestamp to nearest 4-hour interval
    function roundDownTo4Hours(date) {
        date.setHours(Math.floor(date.getHours() / 4) * 4, 0, 0, 0);
        return date;
    }

    // Initialize object to store counts for each interval
    const intervalCounts = {};

    // Define interval duration (4 hours)
    const intervalDuration = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

    // Loop through data and count timestamps in each interval
    data.forEach(item => {
        const timestamp = parseTimestamp(item["Timestamp"]);
        const intervalStart = roundDownTo4Hours(new Date(timestamp));
        if (!intervalCounts[intervalStart.getTime()]) {
            intervalCounts[intervalStart.getTime()] = 0;
        }
        intervalCounts[intervalStart.getTime()]++;
    });

    const newData = [];
    // Print the counts for each interval
    Object.keys(intervalCounts).sort().forEach(intervalStartms => {
        const intervalEnd = new Date(Number(intervalStartms) + intervalDuration);
        const intervalStart = new Date(Number(intervalStartms));
        const interval = `${intervalStart.toLocaleString()} - ${intervalEnd.toLocaleString()}`
        const dataPoint = { x: interval, y: intervalCounts[intervalStartms]};
        newData.push(dataPoint);
        console.log(`Interval: ${intervalStart.toLocaleString()} - ${intervalEnd.toLocaleString()}, Count: ${intervalCounts[intervalStartms]}`);
    });
    return (
        <MixedLineBarChart
            series={[
                {
                    title: "Notifications",
                    type: "bar",
                    data: newData,
                    valueFormatter: e =>
                        "$" +
                        e.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })
                },]}
            xDomain={newData.map(d => d.x)}
            yDomain={[0, 20]}
            i18nStrings={{
                yTickFormatter: function numberFormatter(e) {
                    return Math.abs(e) >= 1e9
                        ? (e / 1e9).toFixed(1).replace(/\.0$/, "") +
                        "G"
                        : Math.abs(e) >= 1e6
                            ? (e / 1e6).toFixed(1).replace(/\.0$/, "") +
                            "M"
                            : Math.abs(e) >= 1e3
                                ? (e / 1e3).toFixed(1).replace(/\.0$/, "") +
                                "K"
                                : e.toFixed(2);
                }
            }}
            detailPopoverSeriesContent={({ series, x, y }) => ({
                key: series.title,
                value: (
                    <Link
                        external="true"
                        href="#"
                        ariaLabel={`See details for  on ${series.title} (opens in a new tab)`}
                    >
                    </Link>
                )
            })}
            ariaLabel="Mixed bar chart"
            height={400}
            xScaleType="categorical"
            xTitle="Notification Timestamp by 4 Hour Interval"
            yTitle="Notification Count"
            empty={
                <Box textAlign="center" color="inherit">
                    <b>No data available</b>
                    <Box variant="p" color="inherit">
                        There is no data available
                    </Box>
                </Box>
            }
            noMatch={
                <Box textAlign="center" color="inherit">
                    <b>No matching data</b>
                    <Box variant="p" color="inherit">
                        There is no matching data to display
                    </Box>
                    <Button>Clear filter</Button>
                </Box>
            }
        />
    );
}

export default Chart;