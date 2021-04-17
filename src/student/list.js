import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import api from "../config/axios";
import qs from "qs";
import {withStyles} from "@material-ui/core";


const headCells = [
    {id: 'id', numeric: true, disablePadding: true, label: 'Id'},
    {id: 'email', numeric: false, disablePadding: false, label: 'Email Address'},
    {id: 'name', numeric: false, disablePadding: false, label: 'Student Name'},
    {id: 'enrollmentNo', numeric: false, disablePadding: false, label: 'Enrollment Number'},
];

function EnhancedTableHead(props) {
    const {classes, order, orderBy, onRequestSort} = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align='right'
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                            ) : null}
                        </TableSortLabel>
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    mousePointer: {
        cursor: 'pointer'
    }
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.grey['500'],
        color: theme.palette.common.black,
        fontWeight: 'bold'
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

export default function StudentList(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = React.useState([]);
    const [pagination, setPagination] = React.useState([]);
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        setPage(0);
    };

    useEffect(() => {
        const payload = {query: {page_number: page + 1, sort: `${orderBy}::${order}`}}
        api.get(`students?${qs.stringify(payload)}`).then(({data}) => {
            const {students, meta} = data;
            setRows(students);
            setPagination(meta.pagination);
        })
    }, [page, orderBy, order])

    const handleClick = (event, id) => {
        props.history.push(`/students/${id}`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const isLastPage = pagination.isOutOfRange || pagination.isLastPage

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {rows.map((row) => {
                                const labelId = `enhanced-table-row-${row.id}`;

                                return (
                                    <TableRow
                                        className={classes.mousePointer}
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        tabIndex={-1}
                                        key={row.name}
                                    >
                                        <TableCell component="th" id={labelId} scope="row" align="right" padding="none">
                                            {row.id}
                                        </TableCell>
                                        <TableCell align="right">{row.email}</TableCell>
                                        <TableCell align="right">{row.name}</TableCell>
                                        <TableCell align="right">{row["enrollment_no"]}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={-1}
                    nextIconButtonProps={{disabled: isLastPage}}
                    rowsPerPageOptions={[15]}
                    labelDisplayedRows={({from, to, count}) => {
                        return isLastPage ? `${from}-${to}` : `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
                    }}
                    rowsPerPage={15}
                    page={page}
                    onChangePage={handleChangePage}
                />
            </Paper>
        </div>
    );
}
