import React, {Component} from 'react'
import {FaGithubAlt, FaPlus, FaSpinner} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import api from '../../services/api'

import {Container, Form, SubmitButton, List} from './styles'

export default class Main extends Component{

  state = {
    newRepo: '',
    repositories: [],
    loading: 0
  }

  //Loading data from localStorage
  componentDidMount(){
    const repositories = localStorage.getItem('repositories')

    if (repositories){
      this.setState({repositories: JSON.parse(repositories)})
    }
  }

  //Save data from localStorage
  componentDidUpdate(_, prevState){

    const {repositories} = this.state

    if (prevState.repositories !== repositories){
      localStorage.setItem('repositories', JSON.stringify(repositories))
    }
  }


  handleInputChange = e => {
    this.setState({newRepo: e.target.value})
  }

  handleSubmit = async e => {
    e.preventDefault()

    this.setState({loading: 1})

    const {newRepo, repositories} = this.state
    const response = await api.get(`/repos/${newRepo}`)

    const data = {
      name: response.data.full_name
    }

    this.setState({
      repositories: [...repositories, data],
      newRepo: '',
      loading: 0
    })

  }

  render(){
    const {newRepo, repositories, loading} = this.state
  return (
    <Container>
      <h1>
        <FaGithubAlt />
        Repositories
      </h1>

      <Form onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Add repository"    
          value={newRepo}    
          onChange={this.handleInputChange}
        />

        <SubmitButton loading={loading}>
          { loading ? <FaSpinner color="#FFF" size={14} /> : 
          <FaPlus color="#FFF" size={14}/> }
        </SubmitButton>
      </Form>

      <List>
        {repositories.map(repository => (
          <li key={repository.name}>
            <span>{repository.name}</span>
            <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Details</Link>
          </li>
        ))}
      </List>
    </Container>
  )
}
}