import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import useAttendanceContext from '../AttendanceContext';
import { fetchDailyStatistics } from '../../../../api/attendanceAPI';

const DailyStatisticsTable = () => {
  const { sectionId, month, year, loading, setLoading} = useAttendanceContext();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  
  const fetchData = async () => {
    try {
        setLoading(true);
        const response = await fetchDailyStatistics(sectionId,month,year)
        const statusCounts = response[0]?.status_counts;
        const statusTypes = statusCounts ? Object.keys(statusCounts).filter(item => item !== 'Holiday') : [];

        const formattedData = response.map((item, index) => ({
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
      } 
    catch (error) {
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
