import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { fetchDailyStatistics } from '../../../../api/attendanceAPI';
import { useMainContext } from '../../../../Context/MainContext';
import useAttendanceContext from "../../../../Context/AttendanceContext";
import { Modal } from 'antd';

const DailyStatisticsTable = () => {
  const {
    monthId,
    loading,
    setLoading,dailyStatisticsVisible,setDailyStatisticsVisible,
  } = useAttendanceContext();
  const {sectionId,year}= useMainContext()
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  
  const fetchData = async () => {
    try {
        setLoading(true);
        const response = await fetchDailyStatistics(sectionId,monthId,year)
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
  }, [sectionId, monthId, year]);

  return (
    <Modal
         open={dailyStatisticsVisible}
         onCancel={() => setDailyStatisticsVisible(false)}
         footer={null}
         centered
         title={"Daily Statistics"}
         zIndex={100003}
         width={1300}
        >
          <DataGrid
            rows={data}
            columns={columns.map(col => ({ ...col, resizable: false }))}
            pagination={false}
            hideFooter={true}
            disableColumnMenu
            rowHeight={30}
            loading={loading}
            sx={{
              width: "100%",
              height: "600px",
              overflow: "hidden",
              marginTop: "1rem",
            }}
          />
    </Modal>
  );
};

export default DailyStatisticsTable;
