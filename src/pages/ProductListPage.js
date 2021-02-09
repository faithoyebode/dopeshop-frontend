import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaCheck, FaTimes, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProducts } from '../actions/productActions';
import { decodeEntity } from '../utils';

const ProductListPage = ({ match }) => {
    const dispatch = useDispatch();

    const history = useHistory();
    
    const productList = useSelector(state => state.productList);
    const { loading, error, products } = productList;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const deleteHandler = (id) => {
        if(window.confirm('Are you sure?')){
            // DELETE PRODUCTS
        }
    }

    const createProductHandler = (product) => {
        //CREATE PRODUCT
    }

    useEffect(() => {
        if(userInfo && userInfo.isAdmin){
            dispatch(listProducts());
        }else{
            history.push('/login')
        }
    }, [dispatch, history, userInfo]);

    
    return (
        <>
        <Row className='align-items-center'>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className='text-right'>
                <Button className='my-3' onClick={createProductHandler}>
                    <FaPlus /> Create Product
                </Button>
            </Col>
        </Row>
          {loading ? 
            <Loader /> : 
            error ? 
            <Message variant='danger'>{error}</Message> :
            (
                <Table striped bordered responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>
                                    {decodeEntity('&#x20A6;')}{product.price} 
                                </td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>
                                    <Button 
                                        variant='danger' 
                                        className='btn-sm'
                                        onClick={() => deleteHandler(product._id)}    
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}   
        </>
    )
}

export default ProductListPage;
