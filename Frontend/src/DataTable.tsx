import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export interface DisplayDataProps {
    condition: string,
    value: number,
    standardHigher: number,
    standardLower: number,
    name: string,
}

function Row(props: { row: DisplayDataProps }) {
    const { row } = props;

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell component="th" scope="row">
                    {row.condition}
                </TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.value}</TableCell>
                <TableCell align="center">{row.standardLower}</TableCell>
                <TableCell align="center">{row.standardHigher}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function CollapsibleTable({ data }: { data: DisplayDataProps[] }) {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell>Condition Name</TableCell>
                        <TableCell align="center">Diagostic matric</TableCell>
                        <TableCell align="center">Value</TableCell>
                        <TableCell align="center">Standard Lower</TableCell>
                        <TableCell align="center">Standard Higher</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <Row key={row.condition} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}