import React from 'react'

export default (props) => (
  <form onSubmit={props.handleSubmit}>
    <div className="col-10">
      <input
        type="text"
        placeholder="search for file"
        value={props.searchValue}
        onChange={props.handleChange}
      />
    </div>
    <div className="col-2">
      <input type="submit" className="pull-right btn" id="search-submit" disabled={props.disabled}/>
    </div>
  </form>
)