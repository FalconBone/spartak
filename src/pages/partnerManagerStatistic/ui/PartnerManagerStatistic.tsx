// import { useState } from 'react';
// import classes from './PartnerManagerStatistic.module.scss'
// import { AgGridReact } from 'ag-grid-react';

// const PartnerManagerStatistic = () => {
    
//     const GridExample = () => {
//     // Row Data: The data to be displayed.
//     const [rowData, setRowData] = useState([
//         { make: "Tesla", model: "Model Y", price: 64950, electric: true },
//         { make: "Ford", model: "F-Series", price: 33850, electric: false },
//         { make: "Toyota", model: "Corolla", price: 29600, electric: false },
//     ]);

//     // Column Definitions: Defines the columns to be displayed.
//     const [colDefs, setColDefs] = useState([
//         { field: "Партнер" },
//         { field: "Общий средний спенд" },
//         { field: "Общий средний спенд " },
//         { field: "electric" }
//     ]);

//     // ...
// }
    
//     return (
//         <div className={classes.container}>
//             <AgGridReact
//                 rowData={rowData}
//                 columnDefs={colDefs}
//             />
//         </div>
//     )
// }