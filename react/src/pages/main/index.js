import React, { Component } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

import './styles.css';

export default class Main extends Component {
  constructor(props) {
      super(props);    
      this.state = {
        page: 1,
        totalPage: 0,
        products: [],
        title: '',
        description: '',
        url: '',
        edit: false,
        id: '',
      }

     this.copy = this.state;
  }

  componentDidMount() {
    this.loadProducts();

  }

  loadProducts = async (page = 1) => {
    const response = await api.get(`/products?page=${page}`);
    
    this.setState({ page: Number(response.data.page) })
    this.setState({ totalPage: Number(response.data.pages) });
    this.setState({ products: response.data.docs });
 
  }

  prevPage = () => {
    const page = this.state.page;
    if(page > 1){
      const prevPage = page -1;
      this.loadProducts(prevPage);
      return;
    }

  }

  nextPage = () => {
    const page = this.state.page;
    const totalPage = this.state.totalPage;

    if(page < totalPage){
      const nextPage = page + 1;
      this.loadProducts(nextPage);
      return;
    }
  }

  handleInputChange = ( e ) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    
    this.setState(
      {
        [ name ]: value
      }
    );

  }

  registerProduct = async ( e ) => {
    e.preventDefault();

    const { title, description, url } = this.state;
    const product = {
      title,
      description,
      url
    }
    
    if(product.title && product.description && product.url){
      const response = await api.post('/products', product);
      
      if(response.status === 200){
        alert('Produto Cadastrado com sucesso');
        this.props.history.push(`/products/${response.data.product}`);
        return;
      }
      alert(`Erro ao cadastrar Produto: ${response.data.error.message}`);
    }
    else{
      alert('Preencha todos os dados.')
      return;
    }

  }

  handleEditProduct = async(event, product) => {
    const {title, description, url, _id: id } = product; 
    await this.setState({ edit: true, title, description, url, id });

    const anchor = document.querySelector('#form-id');
    anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });

  }

  editProduct = async( e ) => {
    e.preventDefault();

    const { title, description, url, id } = this.state;
    const product = {
      title,
      description,
      url,
    }
    
    if(product.title && product.description && product.url){
      const response = await api.put(`/products/${id}`, product);
      
      if(response.status === 200){
        alert('Produto Editado com sucesso');
        this.props.history.push(`/products/${response.data._id}`);
        return;
      }
      alert(`Erro ao Editar Produto: ${response.data.error.message}`);
    }
    else{
      alert('Preencha todos os dados.')
      return;
    }
  }

  deleteProduct = async (e, product) => {
    const response = await api.delete(`/products/${product}`);

    if(response.status === 200) {
      alert('Produto deletado com sucesso!')
      this.loadProducts();
      return; 
    }

    alert('Erro ao deletar Produto');
    return;
  }

  cleanForm = async () => {
    const { page, totalPage, products, ...cleanState } = this.copy;
    this.setState(cleanState);
    return;
  }

  render(){
    const { 
      products,
      page, 
      totalPage, 
      title, 
      description, 
      url, 
      edit,
    } = this.state;

    const errorMessage = <span className="error">Campo Obrigatório<sup>*</sup></span>;
    
    const error = {
      title: !title ? errorMessage: '',
      description: !description ? errorMessage: '',
      url: !url ? errorMessage: '',
    }

    return (
      <div className="main-page">  
        <div className="product-form">
          <div className="form-header">
            <strong>
              {!edit? 'Cadastrar novo Produto': `Editar Produto - ${title}`}
            </strong>
          </div>
          <form name="productForm" id="form-id" onSubmit={!edit ? this.registerProduct : this.editProduct}>
            <div className="input-group">
              <label htmlFor="title">Título</label>
              <input 
                type="text" 
                name="title" 
                placeholder="Título do Produto" 
                value={this.state.title}
                onChange={this.handleInputChange}
                required
              />
              {error.title}
            </div>
            <div className="input-group">
              <label htmlFor="description">Descrição</label>
              <textarea 
                name="description" 
                rows="5" 
                value={this.state.description}
                onChange={this.handleInputChange}
                required
              />
                {error.description}
            </div>
            <div className="input-group">
              <label htmlFor="url">URL</label>
              <input 
                  type="text" 
                  name="url" 
                  placeholder="URL do Produto"
                  value={this.state.url}
                  onChange={this.handleInputChange}
                  required
              />
              {error.url}
            </div>
            <div className="form-submit">
              <button type="button" onClick={this.cleanForm}>{!edit? 'Limpar' : 'Cancelar'}</button>
              <button type="submit">{!edit ? 'Cadastrar' : 'Editar'}</button>
            </div>
          </form>
        </div>
        <div className="product-list">
          {
            products.map((product) => (
              <article key={product._id}>
                <div className="product-header">
                  <strong>{product.title}</strong>
                  <div className="product-header-icons">
                    <i 
                      className="edit-icon tooltip"
                      title="Editar Produto." 
                      onClick={(event, prod) => this.handleEditProduct(event, product)}>
                      <img src={ require('./edit.svg')} alt="Edit Product"/>
                    </i>
                    <i 
                      className="edit-icon tooltip"
                      title="Deletar Produto." 
                      onClick={(event, prod) => this.deleteProduct(event, product._id)}>
                      <img src={ require('./trash.svg')} alt="Delete Product"/>
                    </i>
                  </div>
                </div>
                <p>{product.description}</p>
                <Link to={`products/${product._id}`}>Acessar</Link>
              </article>
            ))
          }

          <div className="actions">
            <div className="buttons">
              <button disabled={ page === 1} onClick={this.prevPage}>Anterior</button>
              <button disabled={ page === totalPage} onClick={this.nextPage}>Próxima</button>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
