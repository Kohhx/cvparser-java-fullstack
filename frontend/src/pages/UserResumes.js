import React, { useState } from 'react';
import './css/Upload.css';
import DocViewer from 'react-doc-viewer';
import 'bootstrap/dist/css/bootstrap.css';

const UserResumes = () => {
    return (
        <div>
            <table className="table table-bordered">
                <thead>
                    <tr className="table-active">
                        <th scope="col">Candidate</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone Number</th>
                        <th scope="col">Resume download</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark@gmail.com</td>
                        <td>92340123</td>
                        <td>resume_20230901</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>kohhx@gmail.com</td>
                        <td>92313414</td>
                        <td>resume_20230902</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td >james@hotmail.com</td>
                        <td>81232940</td>
                        <td>resume_20230904</td>
                    </tr>

                </tbody>
            </table>
        </div>
    );
}

export default UserResumes;
