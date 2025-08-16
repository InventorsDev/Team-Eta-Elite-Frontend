const Table = (props) => {
    return (
        <div className="w-full overflow-x-auto border-2 rounded-lg text-sm border-gray-300">
            <table className="w-full border-collapse">
                <thead className="">
                    <tr className="bg-gray-100 p-8 text-gray-900">
                        {props.headers.map(header => <th key={header} className="p-4 text-left">{header}</th>)}
                    </tr>
                </thead>
                <tbody className="font-semibold">
                    {props.children}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
