import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import NavBar from './NavBar';



function ResumeListUser() {
    const[searchterms, setSearchTerms]= useState('')

  return (
    
    <div/*  className='resume-list-main-container' */>
        
       
        <input
            type='text'
            className='search-input'
            placeholder='Search skills  '
            onChange={(event) => setSearchTerms(event.target.value)}
          />
        <table class="table-warning">
        <tr>
            <th>Resume </th>
            <th>Skills</th>
            <th>Years of Experiences</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th colSpan={2}>Action</th>
        </tr>

        <tr class="table-warning">
            <td>Sales Resume </td>
            <td>Skills</td>
            <td>5</td>
            <td>21/06/2023</td>
            <td>Updated At</td>
            <td> <button  className='btn btn-danger'>
                        <FontAwesomeIcon icon={faTrash} />
                        </button></td>

                        <td>
                        <button  className='btn btn-success'>
                        <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </td>
        </tr>

        <tr>
            <td>Customer Service Resume </td>
            <td>Skills</td>
            <td>5</td>
            <td>21/06/2023</td>
            <td>Updated At</td>
            <td> <button  className='btn btn-danger'>
                        <FontAwesomeIcon icon={faTrash} />
                        </button></td>

                        <td>
                        <button className='btn btn-success'>
                        <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </td>
        </tr>

        <tr>
            <td>Technical Resume </td>
            <td>Skills</td>
            <td>5</td>
            <td>21/06/2023</td>
            <td>Updated At</td>
            <td> <button  className='btn btn-danger'>
                        <FontAwesomeIcon icon={faTrash} />
                        </button></td>

                        <td>
                        <button className='btn btn-success'>
                        <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </td>
        </tr>
        <tr class="table-warning">
            <td>Logistic Resume </td>
            <td>Skills</td>
            <td>5</td>
            <td>21/06/2023</td>
            <td>Updated At</td>
            <td> <button  className='btn btn-danger'>
                        <FontAwesomeIcon icon={faTrash} />
                        </button></td>

                        <td>
                        <button className='btn btn-success'>
                        <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </td>
        </tr>
    </table>
        </div>
       
    
    



   
  )
}

export default ResumeListUser