import React, { Component } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

import './styles.css'

export default class Product extends Component {
  state = {
    product: {}
  }

  async componentDidMount(){
    const { id } = this.props.match.params;
    try {
      const response = await api.get(`/products/${id}`);
      this.setState({product: response.data.product})
    }
    catch(err){
      console.log(err.response);
    }
  
  }

  render (){
    const { product } = this.state
    if(Object.keys(product).length !== 0){
      return (
        <div className="product-show">
          <div className="product-info">
            <h1>{product.title}</h1>
            <p>{product.description}</p>
  
            <p>
              URL: <a href={product.url}>{product.url}</a>
            </p>
          </div>
  
          <div className="product-back">
              <button><Link to="/">Voltar</Link></button>
          </div>

        </div>
      )
    }

    return (
        <div>
          <div className="product-show">
            <div className="product-info">
              <h1 className="product-error">
                 404
              </h1>
              <h2 className="product-error">
                 PRODUTO NÃO ENCONTRADO!
              </h2>
            </div>
             
            <div className="product-back">
                <button><Link to="/">Voltar</Link></button>
            </div>

          </div>
        </div>
    )
  
  }
}