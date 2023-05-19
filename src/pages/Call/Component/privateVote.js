import React, { useState, useEffect } from 'react';
import axios from "axios";

//Library
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

//Icon
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Refresh from '@mui/icons-material/Refresh';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const THEME = createTheme({
  typography: {
    "fontFamily": `"Kanit", sans-serif`,
    "fontSize": 14,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
  }
});

export default function PrivateVote(prop) {
  const {
    pexRTC,
    meetID,
    vote,
    setSelectTab,
    selectTab,
    listParticipants
  } = prop
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [listVoter, setListVoter] = useState(null)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getAllData()
  }, [])

  function sentVote(uuid, val) {
    updateData(uuid, val)
  }

  async function updateData(uuid, val) {
    try {
      const response = await axios({
        method: "put",
        url: process.env.REACT_APP_API + '/api/vi/activity/update',
        data: {
          meeting_id: meetID,
          callid: uuid,
          vote: val
        }
      });
      if (response.data.result === "Updated") {
        if (val) {
          pexRTC.sendChatMessage('6|&topic-id=' + vote + '*' + uuid)
          getAllData()
        } else {
          pexRTC.sendChatMessage('7|' + uuid)
          getAllData()
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getAllData() {
    try {
      const response = await axios({
        method: "post",
        url: process.env.REACT_APP_API + '/api/vi/activity/getall',
        data: {
          meeting_id: meetID
        }
      });
      if (response.data.message === "Get data success") {
        setListVoter(response.data.data)
        console.log(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function setDefaultData() {
    try {
      const response = await axios({
        method: "put",
        url: process.env.REACT_APP_API + '/api/vi/activity/setvote',
        data: {
          meeting_id: meetID,
        }
      });
      if (response.data.result === "Updated") {
        setSelectTab("VOTE")
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 2 }}>
        <ThemeProvider theme={THEME}>
          <Typography sx={{ mt: 1 }}>เลือกผู้มีสิทธิ์โหวต</Typography>
        </ThemeProvider>
        <button className="sent" onClick={() => setDefaultData()} variant="data">
          <ThemeProvider theme={THEME}>
            <Typography>กลับ</Typography>
          </ThemeProvider>
        </button>
      </Box>
      {listVoter === null ? (
        <Box sx={{ display: 'flex', justifySelf: 'center', alignItems: 'center' }}>
          ไม่มีข้อมูลโหวต
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 330 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>รายชื่อผู้เข้าร่วม</StyledTableCell>
                <StyledTableCell align="right">ส่ง</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? listVoter?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : listVoter
              )?.map((data, i) => (
                <StyledTableRow key={i} >
                  {(listParticipants?.find(user => user?.uuid === data?.call_uuid) !== undefined) ? (
                    <StyledTableCell component="th" scope="row">
                      {data?.name}
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell component="th" scope="row">
                      ยังไม่มีผู้เข้าร่วมประชุม
                    </StyledTableCell>
                  )}
                  {(listParticipants?.find(user => user?.uuid === data?.call_uuid) !== undefined) ? (
                    <StyledTableCell align="right">
                      {data?.vote === true ? (
                        <FormControlLabel control={<Android12Switch checked={true} onClick={() => { sentVote(data?.call_uuid, false) }} />} />
                      ) : (
                        <FormControlLabel control={<Android12Switch checked={false} onClick={() => { sentVote(data?.call_uuid, true) }} />} />
                      )}
                    </StyledTableCell>
                  ) : (
                    <FormControlLabel control={<Android12Switch disabled />} />
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5]}
                  colSpan={3}
                  count={listVoter?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}