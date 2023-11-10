'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')
  
const closeModal = () => {
  clearFields()
  document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem('db_client', JSON.stringify(dbClient))

const deleteClient = (index) => {
  const dbClient = readClient()
  dbClient.splice(index, 1)
  setLocalStorage(dbClient)
}

const updateClient = (index, client) => {
  const dbClient = readClient()
  dbClient[index] = client
  setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()

const createClient = (client) => {
  const dbClient = getLocalStorage()
  dbClient.push(client)
  setLocalStorage(dbClient)
}

const isValidFields = () => {
  return document.getElementById('form').reportValidity()
}

const clearFields = () => {
  const fields = document.querySelectorAll('.modal-field')
  fields.forEach(field => field.value = "")
}

const saveClient = () => {
  if (isValidFields()) {
    const client = {
      nome: document.getElementById('nome').value,
      turma: document.getElementById('turma').value,
      email: document.getElementById('email').value,
      livro: document.getElementById('livro').value,
      data: document.getElementById('data').value
    }
    const index = document.getElementById('nome').dataset.index
    if (index == 'new') {
      createClient(client)
      updateTable()
      closeModal()
    } else {
      updateClient(index, client)
      updateTable()
      closeModal()
    }
  }
}

const createRow = (client, index) => {
  const newRow = document.createElement('tr')
  newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.turma}</td>
    <td>${client.email}</td>
    <td>${client.livro}</td>
    <td>${client.data}</td>
    <td>${`4 dias a partir da data de aquisição`}</td>
    <td>
       <button type="button" class="button green" id="edit-${index}">editar</button>
       <button type="button" class="button red" id="delete-${index}">excluir</button>
    </td>
  `
  document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
  const rows = document.querySelectorAll('#tableClient>tbody tr')
  rows.forEach(row => rows.parentNode.removeChild(row))
}

const updateTable = () => {
  const dbClient = readClient()
  clearTable()
  dbClient.forEach(createRow)
}

const fillFields = (client) => {
  document.getElementById('nome').value = client.nome
  document.getElementById('turma').value = client.turma
  document.getElementById('email').value = client.email
  document.getElementById('livro').value = client.livro
  document.getElementById('data').value = client.data
  document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
  const client = readClient()[index]
  client.index = index
  fillFields(client)
  openModal()
}

const editDelete = (event) => {
  if (event.target.type == 'button') {
    const [action, index] = event.target.id.split('-')
    if (action == 'edit') {
      editClient(index)
    } else {
      const client = readClient()[index]
      const response = confirm(`Deseja excluir o cadastro ${client.nome}?`)
      if (response) {
        deleteClient(index)
        updateTable()
      }
    }
  }
}

updateTable()

document.getElementById('cadastrarCliente').addEventListener('click', openModal)
document.getElementById('modalClose').addEventListener('click', closeModal)
document.getElementById('salvar').addEventListener('click', saveClient)
document.querySelector('#tableClient>tbody').addEventListener('click', editDelete)
