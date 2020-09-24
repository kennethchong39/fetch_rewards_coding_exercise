import React, { useState, useEffect } from 'react';
import './Table.css';

const proxyURL = "https://cors-anywhere.herokuapp.com/";
const dataURL = 'https://fetch-hiring.s3.amazonaws.com/hiring.json';
const safeURL = proxyURL + dataURL;

function Table() {
    const [sortedData, setSortedData] = useState({ 1: [] });
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const response = await fetch(safeURL);
        const data = await response.json();

        // filter out name with null or empty person
        const filterData = data.filter((d) => d.name)
        const sorted = filterData.sort((a, b) => {
            const compareByListId = a.listId - b.listId;

            if (compareByListId !== 0) {
                return compareByListId;
            }

            return a.name.localeCompare(b.name, undefined, {
                numeric: true,
                sensitivity: 'base'
            });
        });

        let pageMap = {};
        let count = 0;
        for (let i = 0; i < sorted.length; i++) {
            if ((i % 15) === 0) count++;
            if (!pageMap[count]) pageMap[count] = [];
            pageMap[count].push(sorted[i]);
        }

        setSortedData(pageMap);
    }

    const setPage = (event) => {
        const last = Object.keys(sortedData).length;
        let keyMap = {
            first: 1,
            previous: currentPage !== 1 ? currentPage - 1 : currentPage,
            next: currentPage !== last ? currentPage + 1 : currentPage,
            last: last,
        }
        setCurrentPage(keyMap[event.target.name]);
    }

    return (
        <div className="container">
            <h1>Fetch Rewards</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>List ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData[currentPage].map((data, index) => {
                        return (
                            <tr>
                                <td>{data.id}</td>
                                <td>{data.listId}</td>
                                <td>{data.name}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <section className="pagination">
                <button disabled={currentPage === 1 ? true : false} onClick={setPage} className="first-page-btn" name="first">First</button>
                <button disabled={currentPage === 1 ? true : false} onClick={setPage} className="first-page-btn" name="previous">Previous</button>
                <button disabled={currentPage === Object.keys(sortedData).length ? true : false} onClick={setPage} className="first-page-btn" name="next">Next</button>
                <button disabled={currentPage === Object.keys(sortedData).length ? true : false} onClick={setPage} className="first-page-btn" name="last">Last</button>
            </section>
        </div>
    )
}

export default Table; 