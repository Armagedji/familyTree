import React from "react";

function UserTable(props) {
    return (
        <table className="table">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Username</th>
                <th scope="col">Password</th>
                <th scope="col">Email</th>
            </tr>
            </thead>
            <tbody>
            {props.name.map((info, index) => {
                return (
                    <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{info.username}</td>
                        <td>{info.password}</td>
                        <td>{info.email}</td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}

export default UserTable;