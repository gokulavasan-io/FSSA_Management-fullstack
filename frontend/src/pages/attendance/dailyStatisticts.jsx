import React, { useEffect, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { format } from 'date-fns';
import API_PATHS from '../../constants/apiPaths';

// Register all Handsontable modules
registerAllModules();

const DailyStatisticsTable = ({ sectionId, month, year }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_PATHS.FETCH_DAILYsTATISTICS}?sectionId=${sectionId}&month=${month}&year=${year}`);
      const result = await response.json();
      console.log(result); // Inspect the response data in the console

      if (response.ok) {
        const statusCounts = result[0]?.status_counts;
        const statusTypes = statusCounts ? Object.keys(statusCounts).filter(item => item !== 'Holiday') : [];

        const formattedData = result.map(item => ({
          date: format(new Date(item.date), 'dd/MM/yyyy'), // Format date to dd/mm/yyyy
          day: `${item.day_name} ${item.is_holiday && !['sun', 'sat'].includes(item.day_name) ? '(holiday)' : ''}`,
          ...Object.keys(item.status_counts).reduce((acc, status) => {
            if (status !== 'Holiday') acc[status] = item.status_counts[status] || 0;
            return acc;
          }, {}),
        }));

        const dynamicColumns = [
          { data: 'date', title: 'Date', width: 150, readOnly: true },
          { data: 'day', title: 'Day', width: 150, readOnly: true },
          ...statusTypes.map(status => ({
            data: status,
            title: status,
            width: 110,
            readOnly: true, // Set each status column to read-only
          })),
        ];

        setColumns(dynamicColumns);
        setData(formattedData);
        setLoading(false);
      } else {
        console.error('Error fetching data:', result);
        setLoading(false);
      }
    } catch (error) {
      console.error('API Error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sectionId, month, year]); // Fetch data when sectionId, month, or year changes

  return (
    <div style={{ width: '80%' }}>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        data.length === 0 ? (
          <p>No data available</p>
        ) : (
          <HotTable
            data={data}
            colHeaders={columns.map(col => col.title)} // Column headers
            columns={columns}
            rowHeaders={true}
            licenseKey="non-commercial-and-evaluation" // Add license key if required
            manualColumnResize={true} // Enable column resizing
            columnSorting={true}
            height={1000} // Adjust table height
            stretchH="all" // Stretch columns to fill the table width
            className="htCenter" // Center align all cell values
            fixedColumnsLeft={2}
          />
        )
      )}
    </div>
  );
};

export default DailyStatisticsTable;
