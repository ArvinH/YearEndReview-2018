import React from 'react';
import { ResponsiveCalendar } from '@nivo/calendar'

const Calendar = ({data}) => (
  <ResponsiveCalendar
        data={data}
        from="2017-01-01"
        to="2018-12-31"
        emptyColor="#eeeeee"
        colors={[
            "#61cdbb",
            "#97e3d5",
            "#e8c1a0",
            "#f47560"
        ]}
        margin={{
            "top": 100,
            "right": 30,
            "bottom": 60,
            "left": 30
        }}
        yearSpacing={45}
        monthBorderColor="#ffffff"
        monthLegendOffset={10}
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        legends={[
            {
                "anchor": "bottom-right",
                "direction": "row",
                "translateY": 36,
                "itemCount": 4,
                "itemWidth": 34,
                "itemHeight": 36,
                "itemDirection": "top-to-bottom"
            }
        ]}
    />
);

export default Calendar;