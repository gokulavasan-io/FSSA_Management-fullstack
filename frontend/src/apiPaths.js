// paths.js
const API_PATHS = {
    GET_STUDENTS_NAME: 'http://localhost:8000/students/studentsName/',
    GET_STUDENTS_DATA: "http://localhost:8000/students/studentsData/",
    POST_STUDENTS_DATA: "http://localhost:8000/students/studentsData/",
    POST_MARK: "http://127.0.0.1:8000/marks/add_mark/",
    GET_MARK: "http://127.0.0.1:8000/marks/get_mark/",
    UPDATE_MARK: "http://127.0.0.1:8000/marks/update_mark/",
    GET_TEST_NAMES: "http://127.0.0.1:8000/marks/fetch_test_names/",
    RENAME_TEST: "http://127.0.0.1:8000/marks/rename_test/",
    ARCHIVE_STATUS_CHANGE: "http://127.0.0.1:8000/marks/archive_status_change/",
  };
  
export default API_PATHS;
  