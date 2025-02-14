import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import API_PATHS from '../../../constants/apiPaths';
import useAttendanceContext from '../AttendanceContext';

const DailyStatisticsTable = () => {
  const { sectionId, month, year, data, setData, loading, setLoading, columns, setColumns } = useAttendanceContext();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_PATHS.FETCH_DAILYsTATISTICS}?sectionId=${sectionId}&month=${month}&year=${year}`);
      const result = await response.json();
      console.log(result);

      if (response.ok) {
        const statusCounts = result[0]?.status_counts;
        const statusTypes = statusCounts ? Object.keys(statusCounts).filter(item => item !== 'Holiday') : [];

        const formattedData = result.map((item, index) => ({
          id: index,
          date: format(new Date(item.date), 'dd/MM/yyyy'),
          day: `${item.day_name} ${item.is_holiday && !['sun', 'sat'].includes(item.day_name) ? '(holiday)' : ''}`,
          ...Object.keys(item.status_counts).reduce((acc, status) => {
            if (status !== 'Holiday') acc[status] = item.status_counts[status] || 0;
            return acc;
          }, {}),
        }));

        const dynamicColumns = [
          { field: 'date', headerName: 'Date',flex: 1 },
          { field: 'day', headerName: 'Day', flex: 1 },
          ...statusTypes.map(status => ({
            field: status,
            headerName: status,
            flex: 1,
            sortable: true,
            align: 'center',
            headerAlign: 'center',
            
          })),
        ];

        setColumns(dynamicColumns);
        setData(formattedData);
      } else {
        console.error('Error fetching data:', result);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sectionId, month, year]);

  return (
    <div style={{ width: '80%', height: 600, margin: 'auto' }}>
      {loading ? (
        <CircularProgress style={{ display: 'block', margin: '50px auto' }} />
      ) : (
        data.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No data available</p>
        ) : (
          <DataGrid
            rows={data}
            columns={columns.map(col => ({ ...col, resizable: false }))}
            pagination={false}
            hideFooter={true}
            disableColumnMenu
            rowHeight={30}
          />
        )
      )}
    </div>
  );
};

export default DailyStatisticsTable;
