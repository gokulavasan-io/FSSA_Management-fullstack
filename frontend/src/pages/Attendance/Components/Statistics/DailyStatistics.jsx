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
      const response = await fetchDailyStatistics(sectionId, monthId, year);
  
      // Directly set the formatted data from the backend
      setData(response);
  
      // Extract dynamic status types from the first record
      const statusCounts = response[0]?.status_counts || {};
      const statusTypes = Object.keys(statusCounts);
  
      // Generate dynamic columns
      const dynamicColumns = [
        { field: 'date', headerName: 'Date', flex: 1 },
        { field: 'day_name', headerName: 'Day', flex: 1 },
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
    } catch (error) {
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
