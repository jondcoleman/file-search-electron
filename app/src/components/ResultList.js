import React from 'react'
import ResultItem from './ResultItem'

export default (props) => {
  if (!props.files) return null
  if (props.files.length < 1) return <div>No results found.</div>
  else return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>File Name</th>
          <th>Date Created</th>
          <th>Date Modified</th>
        </tr>
      {props.files.map((result, i) => {
        return <ResultItem {...result} key={i}/>})
      }
      </tbody>
    </table>
  )
}