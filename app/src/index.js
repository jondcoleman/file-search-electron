import path from 'path'
import {render} from 'react-dom'
import React, {Component} from 'react'
import {remote} from 'electron'
import {VelocityTransitionGroup, VelocityComponent} from 'velocity-react'

// helpers and utils
import db from './db'
import walk from './utils/walk'
import getConfig from './utils/getConfig'
import setConfig from './utils/setConfig'

// components
import Spinner from './components/Spinner'
import SearchForm from './components/SearchForm'
import ResultList from './components/ResultList'
import ListItemDeletable from './components/ListItemDeletable'

// electron file open dialog
const dialog = remote.dialog
const app = remote.app

class App extends Component {
  constructor() {
    super()

    this.index = this.index.bind(this)
    this.handleSearchValueChange = this.handleSearchValueChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleAddPath = this.handleAddPath.bind(this)
    this.handleRemovePath = this.handleRemovePath.bind(this)
    this.updateConfig = this.updateConfig.bind(this) 

    this.state = {
      currentFile: '',
      indexCount: 0,
      msg: null,
      err: '',
      searchValue: '',
      queryResults: null,
      config: {
        indexPaths: [],
        ignoredPaths: []
      },
      spin: false
    }
  }
  componentWillMount(){
    this.updateConfig()
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-6">
            <h3>Paths to Index</h3>
            <div>
              {this.state.config.indexPaths.map((x, i) => (
                <ListItemDeletable
                  key={i}
                  dbkey={x.id}
                  text={x.path}
                  pathType="index"
                  handleClick={this.handleRemovePath}
                />
                ))}
            </div>
          </div>
          <div className="col-6">
            <h3>Paths to Ignore</h3>
            <div>
              {this.state.config.ignoredPaths.map((x, i) => (
                <ListItemDeletable
                  key={i}
                  text={x.path}
                  dbkey={x.id}
                  pathType="ignored"
                  handleClick={this.handleRemovePath}
                />
                ))}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <button className="btn btn-outline-inverted" onClick={e => this.handleAddPath(e, 'index')}>Add Path</button>
          </div>
          <div className="col-6">
            <button className="btn btn-outline-inverted" onClick={e => this.handleAddPath(e, 'ignored')}>Add Path</button>
            <button
              id="rebuild-index"
              className="pull-right"
              onClick={this.index}
              disabled={!this.state.config.indexPaths || this.state.config.indexPaths.length < 1  }
            >Rebuild Index</button>
          </div>
        </div>
        <br/>
        <hr/>
        <Spinner spin={this.state.spin} />
        <div className="row">
          <p>{this.state.currentFile}</p>
          <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
            {this.state.msg ? <p key={1}>{this.state.msg}</p> : null}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
            {this.state.err.length > 0 ? <pre className="err-msg" key={1}>{this.state.err}</pre> : null}
          </VelocityTransitionGroup>
          <SearchForm
            searchValue={this.state.searchValue}
            handleChange={this.handleSearchValueChange}
            handleSubmit={this.handleSubmit}
            disabled={this.state.searchValue.length < 3}
          />
        </div>
        <div className="row">
        <ResultList files={this.state.queryResults}/>
        </div>
      </div>
    )
  }

  index() {
    this.setState({spin: true})
    const handleEntry = (entry, stat, count) => this.setState({currentFile: entry, indexCount: count})
    const handleError = (err, entry, stat) => {
      const errMsg = this.state.err.length === 0 ? err.toString() : this.state.err + '\n' + err.toString()
      this.setState({err: errMsg})
    }
    const handleEnd = (count, elapsedTime, files) => {
      const toInsert = files.map((x) => {
        const parsed = path.parse(x.file)
        x.fileName = parsed.base
        x.path = parsed.dir
        return x
      })
      this.setState({msg: 'Adding to database'})
      db.files
        .toCollection()
        .delete()
        .then(() => db.files.bulkAdd(toInsert))
      this.setState({
        currentFile: '',
        spin: false,
        msg: `Found ${count} entries.  Indexing took ${elapsedTime} minutes`
      })
      setTimeout(() => this.setState({msg: null}), 3000)
    }
    walk(handleEntry, handleError, handleEnd)
  }

  handleSearchValueChange(e) {
    e.preventDefault()
    this.setState({ searchValue: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    const query = this.state.searchValue.toLowerCase()
    db.table('files')
      .toCollection()
      .filter(obj => {
        if (obj.fileName.toLowerCase().indexOf(query) >= 0) return true
      })
      .toArray()
      .then((data) => {
        const result = data.map((obj) => {
          obj.stats = JSON.parse(obj.stats)
          return obj
        })
        this.setState({ queryResults: result })
      })
  }

  handleAddPath(e, pathType) {
    e.preventDefault()
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, (filesArr) => {
      const method = pathType === 'index' ? setConfig.addIndexPath : setConfig.addIgnoredPath
      method(filesArr[0], () => {
        this.updateConfig()
      })
    })
  }

  handleRemovePath(e, pathType, key) {
    e.preventDefault()
    const method = pathType === 'index' ? setConfig.removeIndexPath : setConfig.removeIgnoredPath
    method(key, () => {
      this.updateConfig()
    })
  }

  updateConfig() {
    getConfig((config) => {
      this.setState({
        config,
        err: !config.indexPaths || config.indexPaths.length < 1 ? 'Error: Missing Index Path' : ''
      })
    })
  }
}

render(<App />, document.getElementById('app'))