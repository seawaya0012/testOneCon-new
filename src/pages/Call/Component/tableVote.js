import React, { useState, useEffect } from 'react';
import axios from "axios";

//Library
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

// var windowReference = window.open();

export default function TableVote(prop) {
  const {
    pexRTC,
    stateVote,
    setStateVote,
    setSelectTab,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    indVote,
    setindVote,
    setVote,
    setOpenDialog,
    meetID,
    setVoteSecret } = prop
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dataVote, setDataVote] = useState(null);
  const [jwt, setJwt] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    openVote()
  }, []);

  async function getData(jwtOneChat) {
    try {
      const response = await axios({
        method: "get",
        url: process.env.REACT_APP_HOST_VOTE_SYSTEM + '/api/v1/voting-topic/list?limit=10&page=1',
        headers: { Authorization: `Bearer ${jwtOneChat}` },
      });
      if (response.data.message === "OK") {
        setDataVote(response.data.result)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function openVote() {
    try {
      const response = await axios({
        method: "get",
        url: process.env.REACT_APP_ONEID + '/api/v2/service/shared-token',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.data.result === "Success") {
        const data = response.data.data.shared_token
        getJWTOneChat(data)
      }
    } catch (error) {
      refresh_Token('vote')
      // setOpenDialog(false)
      // Swal.fire({
      //   title: "token หมดอายุ กรุณา login ใหม่อีกครั้ง",
      //   text: "",
      //   icon: "error",
      //   showCancelButton: false,
      //   confirmButtonText: 'ตกลง',
      //   reverseButtons: true
      // })
    }
  }

  async function getJWTOneChat(data) {
    try {
      const response = await axios({
        method: "get",
        url: process.env.REACT_APP_HOST_VOTE_SYSTEM + '/api/v1/login/user/blockchain_scoring/shared-token?shared_token=' + data
      });
      if (response.data.message === "OK") {
        setJwt(response.data.result.jwt)
        getData(response.data.result.jwt)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function checkTypeVote(data) {
    try {
      const response = await axios({
        method: "get",
        url: process.env.REACT_APP_HOST_VOTE_SYSTEM + '/api/v1/voting-topic/list/byid?id=' + data,
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (response.data.result.topic_type === "OneConference_Private") {
        setSelectTab("privateVote")
        setVoteSecret(true)
        setDefaultData()
      } else {
        pexRTC.sendChatMessage('1|&topic-id=' + data)
        setVoteSecret(false)
      }
    } catch (error) {
      console.log(error);
    }
  }

  function stateVoteOpen(vote, i) {
    if (stateVote === false) {
      setStateVote(true)
      setindVote(i)
      setVote(vote)
      checkTypeVote(vote)
    } else {
      setStateVote(false)
      setindVote(null)
      pexRTC.sendChatMessage('2')
      setVoteSecret(false)
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
        console.log(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function goPage() {
    try {
      const response = await axios({
        method: "get",
        url: process.env.REACT_APP_ONEID + '/api/v2/service/shared-token',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.data.result === "Success") {
        const data = response.data.data.shared_token
        setTimeout(() => {
          window.open(process.env.REACT_APP_HOST_VOTE_SYSTEM + '/login-admin?shared-token=' + data, '_blank');
        })
        // url(process.env.REACT_APP_HOST_VOTE_SYSTEM + '/login-admin?shared-token=' + data)
      }
    } catch (error) {
      refresh_Token('goPage')
      // setOpenDialog(false)
      // Swal.fire({
      //   title: "token หมดอายุ กรุณา login ใหม่อีกครั้ง",
      //   text: "",
      //   icon: "error",
      //   showCancelButton: false,
      //   confirmButtonText: 'ตกลง',
      //   reverseButtons: true
      // })
    }
  }

  // --------------
  async function refresh_Token(type) {
    try {
      const response = await axios({
        method: "post",
        url: process.env.REACT_APP_ONEID + '/api/oauth/get_refresh_token',
        data: {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: "230",
          client_secret: "UBPf9z2XMcpJ79Gj0l1khXw6UDHv5bauPvFUWFpq"
        },
      });
      if (response.data.result === "Success") {
        setRefreshToken(response.data.refresh_token)
        setAccessToken(response.data.access_token)
        if (type === 'vote') {
          openVoteRefresh(response.data.access_token)
        } else goPageRefresh(response.data.access_token)
      }
    } catch (error) {
      Swal.fire({
        title: "token หมดอายุ กรุณา login ใหม่อีกครั้ง",
        text: "",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: 'ตกลง',
        reverseButtons: true
      })
    }
  }
  async function openVoteRefresh(access_Token) {
    try {
      const response = await axios({
        method: "get",
        url: process.env.REACT_APP_ONEID + '/api/v2/service/shared-token',
        headers: { Authorization: `Bearer ${access_Token}` },
      });
      if (response.data.result === "Success") {
        const data = response.data.data.shared_token
        getJWTOneChat(data)
      }
    } catch (error) {
      setOpenDialog(false)
      Swal.fire({
        title: "token หมดอายุ กรุณา login ใหม่อีกครั้ง",
        text: "",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: 'ตกลง',
        reverseButtons: true
      })
    }
  }
  async function goPageRefresh(access_Token) {
    try {
      const response = await axios({
        method: "get",
        url: process.env.REACT_APP_ONEID + '/api/v2/service/shared-token',
        headers: { Authorization: `Bearer ${access_Token}` },
      });
      if (response.data.result === "Success") {
        const data = response.data.data.shared_token
        setTimeout(() => {
          window.open(process.env.REACT_APP_HOST_VOTE_SYSTEM + '/login-admin?shared-token=' + data, '_blank');
        })
        // url(process.env.REACT_APP_HOST_VOTE_SYSTEM + '/login-admin?shared-token=' + data)
      }
    } catch (error) {
      setOpenDialog(false)
      Swal.fire({
        title: "token หมดอายุ กรุณา login ใหม่อีกครั้ง",
        text: "",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: 'ตกลง',
        reverseButtons: true
      })
    }
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="sent" onClick={() => goPage()} variant="data"> <span>สร้างโหวต</span>
        </button>
        <button className="btn" onClick={() => openVote()} >
          <p className="paragraph"> Reload </p>
          <span className="icon-wrapper">
            <Refresh className="icon" />
          </span>
        </button>
      </Box>
      <Box sx={{ mt: 2 }}>
        {dataVote === null ? (
          <Box sx={{ display: 'flex', justifySelf: 'center', alignItems: 'center' }}>
            ไม่มีข้อมูลโหวต
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 330 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>หัวขอโหวต</StyledTableCell>
                  <StyledTableCell align="center">สถานะ</StyledTableCell>
                  <StyledTableCell align="right">เปิด - ปิดโหวต</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? dataVote?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : dataVote
                )?.map((data, i) => (
                  <StyledTableRow key={i} >
                    <StyledTableCell component="th" scope="row">
                      {data?.topic_name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {data?.topic_status === 'Sent' &&
                        <div>ปิด</div>
                      }
                      {data?.topic_status === 'Open' &&
                        <div>เปิด</div>
                      }
                      {data?.topic_status === 'Close' &&
                        <div>ยังไม่เปิด</div>
                      }
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {data?.topic_status === 'Sent' &&
                        <FormControlLabel control={<Android12Switch disabled />} />
                      }
                      {data?.topic_status === 'Open' &&
                        <div>
                          {indVote === i ? (
                            <FormControlLabel control={<Android12Switch checked={true} onClick={() => { stateVoteOpen(data?._id, i) }} />} />
                          ) : (
                            <FormControlLabel control={<Android12Switch checked={false} onClick={() => { stateVoteOpen(data?._id, i) }} />} />
                          )}
                        </div>
                      }
                      {data?.topic_status === 'Close' &&
                        <FormControlLabel control={<Android12Switch disabled />} />
                        // <FormControlLabel control={<Android12Switch checked={stateVote} onChange={handleChange} />} />

                      }
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5]}
                    // rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={dataVote?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    // SelectProps={{
                    //   inputProps: {
                    //     'aria-label': 'rows per page',
                    //   },
                    //   native: true,
                    // }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
      </Box>
    </div>
  );
}