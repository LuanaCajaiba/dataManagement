
import { useEffect, createRef, useRef } from "react";

export const Table = ({ array }) => {
    const rowsRef = useRef([]);

    useEffect(() => {
        console.log(rowsRef);
    }, [rowsRef]);

    useEffect(() => {
        rowsRef.current = rowsRef.current.slice(0, array.length);
    }, [array]);

    useEffect(() => {

    });

    const headerKeys = Object.keys(Object.assign({}, ...array));
    return (
        <table>
            <thead>
                <tr>
                    {headerKeys.map((key) => (
                        <th key={key}>{key}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {array.map((item, index) => (
                    <tr key={item.id} >
                        {Object.values(item).map((val) => (
                            <td ref={element => rowsRef.current[index] = element} key={val}>{val}</td >
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>)

}

